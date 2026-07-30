import casualImg from "../assets/dress-styles/casual.png";
import formalImg from "../assets/dress-styles/formal.png";
import partyImg from "../assets/dress-styles/party.png";
import gymImg from "../assets/dress-styles/gym.png";

export default function DressStyle() {
  return (
    <section className="w-full">
      <div className="mx-auto max-w-[1240px] px-4 py-16">
        <div className="rounded-[40px] bg-surface-100 p-6 sm:p-10">
          <h2 className="text-center font-integral text-3xl font-bold uppercase sm:text-4xl">
            Browse By Dress Style
          </h2>

          <div className="mt-8 flex flex-col gap-5">

            {/* ================= FIRST ROW ================= */}
            <div className="flex flex-col gap-5 sm:flex-row">

              {/* Casual */}
              <div className="relative h-[220px] w-full overflow-hidden rounded-3xl bg-white sm:h-[289px] sm:w-[407px]">
                <img
                  src={casualImg}
                  alt="Casual"
                  className="absolute right-[-60px] top-0 h-full w-auto max-w-none object-contain scale-[1.65]"
                />

                <span className="absolute left-8 top-8 z-10 font-integral text-3xl font-bold">
                  Casual
                </span>
              </div>

              {/* Formal */}
              <div className="relative h-[220px] w-full overflow-hidden rounded-3xl bg-white sm:h-[289px] sm:flex-1 ">
                <img
                  src={formalImg}
                  alt="Formal"
                  className="absolute inset-0 h-full w-full object-cover object-[92%_center] scale-100"
                />

                <span className="absolute left-8 top-8 z-10 font-integral text-3xl font-bold">
                  Formal
                </span>
              </div>

            </div>

            {/* ================= SECOND ROW ================= */}
            <div className="flex flex-col gap-5 sm:flex-row">

              {/* Party */}
              <div className="relative h-[220px] w-full overflow-hidden rounded-3xl bg-white sm:h-[289px] sm:flex-1">
                <img
                  src={partyImg}
                  alt="Party"
                  className="absolute inset-0 h-full w-full object-cover object-[84%_center] scale-[1.25]"
                />

                <span className="absolute left-8 top-8 z-10 font-integral text-3xl font-bold">
                  Party
                </span>
              </div>

              {/* Gym */}
              <div className="relative h-[220px] w-full overflow-hidden rounded-3xl bg-white sm:h-[289px] sm:w-[407px]">
                <img
                  src={gymImg}
                  alt="Gym"
                  className="absolute inset-0 h-full w-full object-cover object-[92%_center] scale-125 pl-24"
                />

                <span className="absolute left-8 top-8 z-10 font-integral text-3xl font-bold">
                  Gym
                </span>
              </div>

            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
