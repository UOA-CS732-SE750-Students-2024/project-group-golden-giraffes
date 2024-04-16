"use client";

import styled from "styled-components";

const Background = styled.div`
  background-color: var(--discord-not-quite-black);
  display: flex;
  flex-direction: column;
  text-align: center;
`;

const Disclaimer = styled.footer`
  color: #808080;
  color: oklch(50% 0 0);
  text-align: inherit;
`;

export default function SignInPage() {
  return (
    <Background>
      <Disclaimer>
        <p>
          Project Blurple and Blurple Canvas are community-driven projects, not affiliated with
          Discord.
        </p>
        <p>Blurple Canvas Web is open source.</p>
      </Disclaimer>
    </Background>
  );
}
