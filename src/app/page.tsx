import { Hero } from "@/widgets/Hero";
import { Legend } from "@/widgets/Legend";
import { Kitchen } from "@/widgets/Kitchen";
import { Spaces } from "@/widgets/Spaces";
import { Interior } from "@/widgets/Interior";
import { Story } from "@/widgets/Story";
import { Events } from "@/widgets/Events";
import { Contacts } from "@/widgets/Contacts";

/** Порядок секций взят из макета: Figma node 114:2368 (main, 1920×14415) */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Legend />
      <Kitchen />
      <Spaces />
      <Interior />
      <Story />
      <Events />
      <Contacts />
    </>
  );
}
