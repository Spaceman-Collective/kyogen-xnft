import Image, { ImageProps, StaticImageData } from "next/image";

const InfoSquare = ({
  size = 60,
  fill = "#9E1424",
  backgroundImage,
}: {
  fill?: string;
  size?: number;
  backgroundImage: ImageProps;
}) => {
  return (
    <div className="relative">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_i_499_26027)">
          <rect width={size} height={size} rx="12" fill={fill} />
        </g>
        <rect
          x="1"
          y="1"
          width="58"
          height="58"
          rx="11"
          stroke="black"
          strokeWidth="2"
        />
        <defs>
          <filter
            id="filter0_i_499_26027"
            x="0"
            y="0"
            width={size}
            height={size}
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="-23" />
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.313726 0 0 0 0 0.0235294 0 0 0 0 0.0470588 0 0 0 0.6 0"
            />
            <feBlend
              mode="normal"
              in2="shape"
              result="effect1_innerShadow_499_26027"
            />
          </filter>
        </defs>
      </svg>
      <Image
        className={`absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] max-w-[${size-15}px] max-h-[${size-15}px]`}
        width={size - 15}
        height={size - 15}
        {...backgroundImage}
        alt={backgroundImage.alt}
      />
    </div>
  );
};

export default InfoSquare;
