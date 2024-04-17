"use client";

import { Button, Typography, styled } from "@mui/material";
import Image from "next/image";

const Background = styled("div")`
  align-items: center;
  background-color: var(--discord-not-quite-black);
  block-size: 100vh;
  display: grid;
  gap: 4rem;
  grid-template-rows: 1fr min-content;
  padding-block: 4rem;
  text-align: center;
`;

const Title = styled(Typography)`
  font-size: 1.5rem;
  font-stretch: 125%;
  font-weight: 900;
`;

const SignInForm = styled("form")`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Footer = styled("footer")`
  color: #808080;
  color: oklch(50% 0 0);
  text-align: inherit;
`;

const Disclaimer = () => (
  <Footer>
    <p>
      Project Blurple and Blurple Canvas are community-driven projects, not affiliated with Discord.
    </p>
    <p>
      Blurple Canvas Web is{" "}
      <a href="https://github.com/UOA-CS732-SE750-Students-2024/project-group-golden-giraffes">
        open source
      </a>
      .
    </p>
  </Footer>
);

export default function SignInPage() {
  return (
    <Background>
      <SignInForm>
        <picture>
          <Image
            src="/images/blurple-canvas-logo~dark.svg"
            alt="Blurple Canvas logo"
            width={60}
            height={60}
          />
        </picture>
        <Title variant="h1">Blurple Canvas</Title>
        <Button variant="contained">Sign in with Discord</Button>
        <p>
          <em>That it. There are no other options.</em>
        </p>
      </SignInForm>
      <Disclaimer />
    </Background>
  );
}
