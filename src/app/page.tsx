import { Hero } from "@/widgets/Hero";
import { Divider } from "@/widgets/Divider";
import { Legend } from "@/widgets/Legend";
import { Kitchen } from "@/widgets/Kitchen";
import { Expect } from "@/widgets/Expect";
import { Interior } from "@/widgets/Interior";
import { Events } from "@/widgets/Events";
import { Contacts } from "@/widgets/Contacts";

/** Порядок секций взят из макета: Figma node 222:1967 (main_2, 1920×8879) */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Divider variant="tickets" />
      <Legend />
      <Divider variant="stamp" />
      <Kitchen />
      <Divider variant="menu" />
      <Expect />
      <Interior />
      <Events />
      <Contacts />
    </>
  );
}
