"use client";

import { useLeaderboard } from "@/hooks/queries/useLeaderboard";
import { styled } from "@mui/material";

const Wrapper = styled("div")`
  display: flex;
  flex-direction: column;
  place-items: center;
  padding: 8rem 4rem;
  gap: 4rem;
`;

const TitleBlock = styled("div")`
  text-align: center;
`;

const Heading = styled("h1")`
  font-stretch: 125%;
  font-weight: 900;
`;

const Subtitle = styled("h2")`
  color: oklch(var(--discord-white-oklch) / 55%);
  font-weight: 400;
`;

const Table = styled("table")`
  font-size: 1.75rem;
  font-variant-numeric: tabular-nums;
  font-weight: 500;
  max-width: 100%;
  width: 40rem;

  th,
  td {
    padding: 1rem;
  }
`;

const RankCell = styled("td")`
  color: oklch(var(--discord-white-oklch) / 45%);
  text-align: center;
`;

const UserCell = styled("td")`
  display: flex;
  font-stretch: 125%;
  font-weight: 900;
  gap: 1rem;
  align-items: center;
`;

const Avatar = styled("img")`
  --stroke-width: max(0.125rem, 1px);

  border-radius: calc(infinity * 1px);
  outline: oklch(var(--discord-white-oklch) / 12%) var(--stroke-width) solid;
  outline-offset: calc(-1 * var(--stroke-width));
`;

const PixelCountCell = styled("td")`
  text-align: center;
`;

const PixelCountCellContents = styled("div")`
  display: grid;
`;

const PixelCount = styled("span")`
  font-weight: 900;
  font-stretch: 125%;
`;

const PixelCountLabel = styled("span")`
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: oklch(var(--discord-white-oklch) / 55%);
`;

export default function Leaderboard() {
  const canvasId = 2023; // change later
  const { data: leaderboard = [] } = useLeaderboard(canvasId);

  return (
    <Wrapper>
      <TitleBlock>
        <Heading>Leaderboard</Heading>
        <Subtitle>Canvas name</Subtitle>
      </TitleBlock>
      <Table>
        <thead hidden>
          <tr>
            <th>Rank</th>
            <th>User</th>
            <th>Pixels placed</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map(
            ({ userId, rank, profilePictureUrl, username, totalPixels }) => (
              <tr key={userId}>
                <RankCell>{rank}</RankCell>
                <UserCell>
                  <Avatar
                    src={profilePictureUrl}
                    alt={`${username}’s avatar`}
                    width={60}
                    height={60}
                  />
                  <p>{username}</p>
                </UserCell>
                <PixelCountCell>
                  <PixelCountCellContents>
                    <PixelCount>{totalPixels.toLocaleString()}</PixelCount>
                    <PixelCountLabel>pixels placed</PixelCountLabel>
                  </PixelCountCellContents>
                </PixelCountCell>
              </tr>
            ),
          )}
        </tbody>
      </Table>
    </Wrapper>
  );
}
