import authVisual from "../../assets/auth/auth-visual.png";
import bigStar from "../../assets/big-star.png";

export default function AuthVisualPanel() {
  return (
    <div className="relative hidden overflow-hidden bg-black lg:block lg:w-[46%]">
      <img
        src={authVisual}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-70"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10" />

      <img
        src={bigStar}
        alt=""
        className="absolute right-[12%] top-[10%] h-10 w-10 opacity-80"
      />

      <div className="relative flex h-full flex-col justify-between p-10 xl:p-14">
        <span className="font-integral text-2xl font-bold text-white">
          SHOP.CO
        </span>

        <div>
          <p className="font-satoshi text-sm uppercase tracking-[0.2em] text-white/60">
            SHOP.CO Members
          </p>
          <h2 className="mt-4 font-integral text-4xl font-bold uppercase leading-[1.05] text-white xl:text-5xl">
            Never Miss
            <br />A Drop
          </h2>
          <p className="mt-4 max-w-sm font-satoshi text-sm leading-relaxed text-white/70">
            Early access to new arrivals, member-only pricing, and a wishlist
            that follows you everywhere.
          </p>
        </div>
      </div>
    </div>
  );
}
