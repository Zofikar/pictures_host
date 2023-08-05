import GetImage from "./GetImage";
import UploadImage from "./UploadImage";


export default function Page() {
  return (
    <main className="w-[100dvw] h-[100dvh]">
      <div className='flex w-full h-[97%] justify-between items-center flex-col md:flex-row'>
        <UploadImage/>
        <div className="md:w-[1px] md:h-full bg-white w-full h-[1px]"></div>
        <GetImage/>
      </div>
      <div className="bg-gray-400 w-full h-[3%] text-center">
        By continuing to use site you accept our&thinsp;<a href="/privacypolicy" className="underline text-blue-300">Privacy Policy</a>
      </div>
    </main>
  )
}
