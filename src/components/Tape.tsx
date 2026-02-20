import StarIcon from "@/assets/Icons/star.svg"
import { Fragment } from "react";

const words = [
  "Performant",
  "Accessible",
  "Secure",
  "Scalable",
  "User Friendly",
  "Modern",
  "Interactive",
  "Responsive",
  "Reliable",
  "Optimized",
  "SEO Friendly",
];

export const TapeSection = () => {
  return (
    <div className="py-16 lg:py-24 overflow-x-clip">
      <div className="bg-gradient-to-r from-emerald-300 to-sky-400 -rotate-3 -mx-1">
        <div className="flex [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex flex-none gap-4 py-3 pr-4 animate-move-left" >
            {[...new Array(2)].fill(0).map((_, idx) => (
              <Fragment key={idx}>
                {words.map((word) => (
                  <div key={word} className="inline-flex gap-4 items-center">
                    <span className="text-gray-900 uppercase font-extrabold text-sm">
                      {word}
                    </span>
                  <img
  src={StarIcon}
  alt="star"
  className="w-6 h-6"
/>
                  </div>
                ))}
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};