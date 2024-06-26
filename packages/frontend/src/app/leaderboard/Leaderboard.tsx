"use client";

import Avatar from "@/components/Avatar";
import { useCanvasContext } from "@/contexts";
import { useLeaderboard } from "@/hooks/queries/useLeaderboard";
import { styled } from "@mui/material";

const Wrapper = styled("div")`
  display: flex;
  flex-direction: column;
  place-items: center;
  padding: 4rem 4rem;
  gap: 4rem;
`;

const TitleBlock = styled("div")`
  text-align: center;
`;

const Table = styled("table")`
  font-size: 1.75rem;
  font-variant-numeric: tabular-nums;
  font-weight: 500;
  inline-size: 40rem;
  max-inline-size: 100%;

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
  align-items: center;
  display: flex;
  font-stretch: 125%;
  font-weight: 900;
  gap: 1rem;
`;

const Username = styled("p")`
  max-inline-size: 22rem;
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
  const { canvas } = useCanvasContext();
  const { data: leaderboard = [] } = useLeaderboard(canvas.id);

  return (
    <Wrapper>
      <TitleBlock>
        <h1>Leaderboard</h1>
        <h2>{canvas.name}</h2>
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
          {leaderboard.map((user) => {
            const { userId, rank, profilePictureUrl, username, totalPixels } =
              user;
            return (
              <tr key={userId}>
                <RankCell>{rank}</RankCell>
                <UserCell>
                  <Avatar
                    username={username ?? userId}
                    profilePictureUrl={profilePictureUrl}
                    size={60}
                  />
                  <Username>{username ?? userId}</Username>
                </UserCell>
                <PixelCountCell>
                  <PixelCountCellContents>
                    <PixelCount>{totalPixels.toLocaleString()}</PixelCount>
                    <PixelCountLabel>pixels placed</PixelCountLabel>
                  </PixelCountCellContents>
                </PixelCountCell>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Wrapper>
  );
}
