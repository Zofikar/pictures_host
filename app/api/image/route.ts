import fs from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

const basepath = "/home/picturesHostData/"


export const config = {
    api: {
      bodyParser: false,
    }
  };


type protectedFile = {
    filename: string,
    psswd: string,
    type: string
}

async function exists (path: string) {  
    try {
      await fs.access(path)
      return true
    } catch {
      return false
    }
  }

function makeid(length: number): string {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

function date2string(date: Date): string{
    return `${date.getUTCDay()}${date.getUTCMonth()}${date.getUTCFullYear()}${date.getUTCHours()}${date.getUTCMilliseconds()}${date.getUTCSeconds()}${date.getUTCMilliseconds()}`
}

export async function POST(req: NextRequest){
    try {
        await fs.readdir(path.join(basepath, "public", "images"));
        await fs.readdir(path.join(basepath, "private", "images"));
    } catch (error) {
        await fs.mkdir(path.join(basepath, "public", "images"), {recursive: true});
        await fs.mkdir(path.join(basepath, "private", "images"), {recursive: true});
    }
    const data = await req.formData()
    const file: File | null = data.get('file') as unknown as File
    if (!file) return NextResponse.json({success: false, detail: "No file"})
    if (!file.type.match(/image\/[A-Za-z]+/i)) return NextResponse.json({success: false, detail: "Not an image"})
    if (file.size >= 4000 * 1024 * 1024) return NextResponse.json({success: false, detail: "Image too big"})
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const psswd = makeid(12)
    const fileext = file.name.slice(file.name.lastIndexOf('.'))
    let jsonfilename = file.name.slice(0, file.name.length-fileext.length)
    while (await exists(path.join(basepath, 'private', 'image', jsonfilename + fileext + '.json'))) {
        jsonfilename = jsonfilename+makeid(1)
    }
    jsonfilename = jsonfilename + fileext;
    const filename = date2string(new Date()) + fileext;
    await fs.writeFile(path.join(basepath, "public", "images", filename), buffer, {flag: 'w'});
    const protectedfile: protectedFile = {filename: filename, psswd, type: file.type}
    await fs.writeFile(path.join(basepath, "private", "images", jsonfilename + '.json'), JSON.stringify(protectedfile), {encoding: "utf-8"})
    return NextResponse.json({ success: true, detail: "Everything went good", psswd: psswd, filename:jsonfilename });
}

export async function GET(req: NextRequest){
    try {
        await fs.readdir(path.join(basepath, "/public", "/images"));
    } catch (error) {
        await fs.mkdir(path.join(basepath, "/public", "/images"));
    }
    const {searchParams} = new URL(req.url)
    const jsonfilename = searchParams.get("filename")
    const psswd = searchParams.get("password")
    if (jsonfilename === 'null') return NextResponse.json({ success: false, detail: "No filename", url: req.url})
    if (psswd === 'null') return NextResponse.json({ success: false, detail: "No password", url: req.url})
    if (!await exists(path.join(basepath, "private", "images", jsonfilename + '.json'))) return NextResponse.json({ success: false, detail: "File does not exist"})
    const protfile = JSON.parse(await fs.readFile(path.join(basepath, "/private", "/images", jsonfilename + '.json'), {encoding: "utf-8"})) as protectedFile
    if(psswd !== protfile.psswd) return NextResponse.json({ success: false, detail: "Wrong password"})
    const data = await fs.readFile(path.join(basepath, "public", "images", protfile.filename))
    return new NextResponse(data, { headers: { 'Content-Type': protfile.type , 'Content-Length': data.length.toString()} })
}