import Image from "next/image"

export default function WelcomeIllustration() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="relative">
        <Image
          src="/person.jpg"
          alt="Person illustration"
          width={1000} // Increased width
          height={800} // Increased height
          className="object-contain"
        />
      </div>
    </div>
  )
}
