import { forwardRef, useImperativeHandle, useRef, useEffect } from "react";
import { Node, Edge, ReactFlow, Controls, useReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { toPng } from "html-to-image";
import DownloadFunnelButton from "../../buttons/DownloadFunnelButton.tsx";

export type ChartExportHandle = {
  exportAsImage: () => Promise<Blob>;
};

type Props = {
  baseNodes: Node[];
  edges: Edge[];
};

function waitForElement(selector: string, timeoutMs = 3000, intervalMs = 100): Promise<HTMLElement> {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const check = () => {
      const el = document.querySelector(selector) as HTMLElement | null;
      if (el) {
        resolve(el);
        return;
      }
      if (Date.now() - start >= timeoutMs) {
        reject(new Error(`${selector} not found`));
        return;
      }
      setTimeout(check, intervalMs);
    };
    check();
  });
}

async function captureFlowAsBlob(fitView: () => void): Promise<Blob> {
  fitView();
  const element = await waitForElement(".react-flow");

  const svgElements = element.querySelectorAll("svg, path, line, polyline, marker");
  svgElements.forEach((el) => {
    const computed = window.getComputedStyle(el);
    (el as HTMLElement).style.stroke = computed.stroke;
    (el as HTMLElement).style.strokeWidth = computed.strokeWidth;
    (el as HTMLElement).style.fill = computed.fill;
  });

  await new Promise((r) => requestAnimationFrame(r));

  const dataUrl = await toPng(element, {
    backgroundColor: "#ececec",
    pixelRatio: 2,
    skipFonts: true,
    cacheBust: true,
    filter: (node) =>
      !(node instanceof HTMLElement && node.classList.contains("react-flow__panel")),
  });
  const res = await fetch(dataUrl);
  return await res.blob();
}

function ExportBridge({ exportRef }: { exportRef: React.MutableRefObject<(() => Promise<Blob>) | null> }) {
  const { fitView } = useReactFlow();
  useEffect(() => {
    exportRef.current = () => captureFlowAsBlob(fitView);
  }, [fitView]);
  return null;
}

const FunnelChart = forwardRef<ChartExportHandle, Props>(({ baseNodes, edges }, ref) => {
  const exportFnRef = useRef<(() => Promise<Blob>) | null>(null);

  useImperativeHandle(ref, () => ({
    exportAsImage: () =>
      exportFnRef.current
        ? exportFnRef.current()
        : Promise.reject(new Error("Funil ainda não está pronto")),
  }));

  return (
    <ReactFlow nodes={baseNodes} edges={edges} fitView proOptions={{ hideAttribution: true }}>
      <Controls />
      <DownloadFunnelButton selector=".react-flow" fileName="StudiesFunnel" />
      <ExportBridge exportRef={exportFnRef} />
    </ReactFlow>
  );
});

export default FunnelChart;