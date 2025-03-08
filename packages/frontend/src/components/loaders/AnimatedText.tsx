import { Typography, styled } from "@mui/material";

import { doesNotStartWith$ } from "@/util";

const LoadingText = styled(Typography)`
  font-size: 11vw;
  padding-block: 2rem;
  font-variation-settings:
    "wght" 100,
    "wdth" 85;
`;

interface AnimatedCharacterProps {
  $index: number;
  $charCount: number;
}

const AnimatedCharacter = styled("span", {
  shouldForwardProp: doesNotStartWith$,
})<AnimatedCharacterProps>((props) => ({
  animation: `breathe ${(props.$charCount + 1) * 400}ms infinite both`,
  animationDelay: `${(props.$index + 1) * 400}ms`,
}));

export interface AnimatedTextProps {
  children: string;
}

export default function AnimatedText({ children }: AnimatedTextProps) {
  const text = children;
  const totalCharacters = text.length;

  return (
    <LoadingText className="loader">
      {text.split("").map((char, index) => (
        <AnimatedCharacter
          key={`${index}-${char}`}
          $index={index}
          $charCount={totalCharacters}
        >
          {char}
        </AnimatedCharacter>
      ))}
    </LoadingText>
  );
}
