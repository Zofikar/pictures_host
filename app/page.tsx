import GetImage from "./GetImage";
import UploadImage from "./UploadImage";


export default function Page() {
  return (
    <main className='flex w-[100dvw] h-[100dvh] justify-between items-center flex-col md:flex-row'>
      <UploadImage/>
      <div className="md:w-[1px] md:h-full bg-white w-full h-[1px]"></div>
      <GetImage/>
    </main>
  )
}
