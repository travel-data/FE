'use client'

import Link from "next/link"
import { useRouter } from "next/navigation";
import QrScanner from "qr-scanner";
import { useEffect, useRef } from "react"

const qrOptions = {
 preferredCamera: "environment",
  maxScansPerSecond: 1,
highlightCodeOutline : true
}

function Page() {
const router = useRouter()
    const videoRef = useRef<HTMLVideoElement>(null);

    const isScannedRef = useRef(false);
    useEffect(() => {
        const videoEle = videoRef.current;
        if (!videoEle) return;

        const qrScanner = new QrScanner(videoEle,   async (result) => {
        if (isScannedRef.current) return;

        isScannedRef.current = true;
        qrScanner.stop();

        window.alert(result.data);
        router.replace('/home');
      }, qrOptions)
       
   const startScanner = async () => {
  try {

    await qrScanner.start();
  } catch (error) {
    console.log('QR scanner error:', error);
    
    if ( error === 'Camera not found.') {
              window.alert('카메라 권한을 허용시켜주세요')

    }
  }
};

    startScanner();
       
           return () => {
             qrScanner.destroy();
           }
    }, [])


  return (
    <main className='min-h-svh flex flex-col items-center p-6'>
        <h3>QR 인증</h3>
            <div className=' flex flex-col gap-4 items-center justify-center h-full w-full  flex-1'>
                <div className='relative h-75 w-full overflow-hidden border rounded-xl'>
                    <video
                        ref={videoRef}
                        className='h-full w-full object-cover'
                        autoPlay
                        playsInline
                        muted
                    />
                </div>

                <Link href='/home' className='bg-bg-card w-full rounded-2xl text-text-heading py-3 text-center block'>돌아가기</Link>
            </div>
    </main>
  )
}

export default Page
