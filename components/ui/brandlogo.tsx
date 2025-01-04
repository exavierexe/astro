import Image from "next/image"

export function BrandLogo() {
    return (
        
        <span className="flex items-center gap-2 font-semibold flex-shrink-0 text-lg">
            <Image alt="" src="/favicon.ico" width="100" height="100" className="size-8"/>
            <Image alt="" src="/0.png" width="100" height="100" className="size-8"/>
            <span>Exavier&apos;s School</span>
        </span>
        
    )
}