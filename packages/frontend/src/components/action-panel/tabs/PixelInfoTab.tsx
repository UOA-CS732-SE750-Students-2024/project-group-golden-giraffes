// import { usePalette, usePixelHistory } from "@/hooks";
// import {
//   PaletteColor,
//   PixelHistoryRecord,
//   Point,
// } from "@blurple-canvas-web/types";
// import { styled } from "@mui/material";

// import { useEffect, useState } from "react";
// import { PaletteColorRecord, colorToSwatch } from "../color/Color";
// import { ActionMenu, Heading } from "./ActionPanel";
// import CoordinatesCard from "./CoordinatesCard";

// const StyledCoordinatesCard = styled(CoordinatesCard)`
//   grid-column: 1 / -1;
// `;

// export const HistoryRecords = styled("div")`
//   display: grid;
//   grid-column: 1 / -1;
//   row-gap: 1.5rem;
// `;

// export const Record = styled("div")`
//   align-items: center;
//   display: flex;
//   gap: 1rem;
//   justify-content: space-between;
// `;

// export const RecordInfo = styled("div")`
//   display: flex;
//   flex-direction: column;
//   flex: 1;
//   gap: 0.5rem;
// `;

// export const RecordAuthor = styled("span")`
//   font-size: 1.3rem;
// `;

// export const RecordColor = styled("div")`
//   opacity: 0.6;
// `;
// export const HistoryRecordComponent = ({
//   history,
//   color,
// }: {
//   history: PixelHistoryRecord;
//   color?: PaletteColor;
// }) => {
//   return (
//     <Record>
//       {color && colorToSwatch(color)}
//       <RecordInfo>
//         <RecordAuthor title={history.userProfile.id}>
//           {history.userProfile.username}
//         </RecordAuthor>
//         {color && (
//           <RecordColor>
//             <PaletteColorRecord color={color} displaySwatch={false} />
//           </RecordColor>
//         )}
//       </RecordInfo>
//     </Record>
//   );
// };

// interface PixelInfoTabProps {
//   coordinates: Point;
//   canvasId: number;
// }

// export default function PixelInfoTab({
//   coordinates,
//   canvasId,
// }: PixelInfoTabProps) {
//   const { data: palette = [], isLoading: colorsAreLoading } = usePalette();

//   const { data: pixelHistory = [], isLoading: historyIsLoading } =
//     usePixelHistory(canvasId, coordinates);

//   const [currentPixelHistory, setCurrentPixelHistory] =
//     useState<PixelHistoryRecord | null>(null);
//   const [pastPixelHistory, setPastPixelHistory] = useState<
//     PixelHistoryRecord[]
//   >([]);

//   useEffect(() => {
//     setCurrentPixelHistory(pixelHistory[0] || null);
//     setPastPixelHistory(pixelHistory.slice(1) || []);
//   }, [pixelHistory]);

//   // Do this ⬇️ to cancel history query
//   // queryClient.cancelQueries({
//   //   queryKey: ["pixelHistory", canvasId, coordinates],
//   // });

//   return (
//     <ActionMenu>
//       <div>
//         <StyledCoordinatesCard coordinates={coordinates} />
//         {currentPixelHistory && ( // To be redesigned later
//           <HistoryRecords>
//             <HistoryRecordComponent
//               history={currentPixelHistory}
//               color={palette.find(
//                 (color) => color.id === currentPixelHistory.colorId,
//               )}
//             />
//           </HistoryRecords>
//         )}
//         <Heading>Paint history</Heading>
//         {pastPixelHistory && (
//           <HistoryRecords>
//             {pastPixelHistory.map((history) => (
//               <HistoryRecordComponent
//                 key={history.id}
//                 history={history}
//                 color={palette.find((color) => color.id === history.colorId)}
//               />
//             ))}
//           </HistoryRecords>
//         )}
//       </div>
//     </ActionMenu>
//   );
// }
