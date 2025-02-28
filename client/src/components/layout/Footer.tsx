import { Button } from "../ui/button";

export default function Footer() {
  return (
    <footer className="w-full bg-zinc-300/25 py-4">
      <ul className="container flex w-full flex-col items-center justify-center">
        <li className="font-semibold">Melvunx for Mission Locale</li>
        <li className="italic">
          Svg from
          <Button variant="link" className="mx-1 p-0 italic">
            <a href="https://www.freepik.com/">Freepik</a>
          </Button>
        </li>
      </ul>
    </footer>
  );
}
