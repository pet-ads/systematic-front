import { Button } from "@chakra-ui/react";
import { Panel, useReactFlow } from "@xyflow/react";
import { toPng } from "html-to-image";
import { FiDownload } from "react-icons/fi";

type Props = {
  selector: string;
  fileName: string;
};

export default function DownloadFunnelButton({ selector, fileName }: Props) {
  function downloadImage(dataUrl: string) {
    const a = document.createElement("a");
    a.setAttribute("download", `${fileName}.png`);
    a.setAttribute("href", dataUrl);
    a.click();
  }

  const { fitView } = useReactFlow();

  const handleClick = (): void => {
    fitView();

    setTimeout(() => {
      const element = document.querySelector(
        selector
      ) as HTMLElement | null;
      if (!element) {
        console.warn( selector + " not found.");
        return;
      }

      // Força estilos inline no SVG antes de capturar para renderizar as edges
      const svgElements = element.querySelectorAll(
        "svg, path, line, polyline, marker"
      );
      svgElements.forEach((el) => {
        const computed = window.getComputedStyle(el);
        (el as HTMLElement).style.stroke = computed.stroke;
        (el as HTMLElement).style.strokeWidth = computed.strokeWidth;
        (el as HTMLElement).style.fill = computed.fill;
      });

      requestAnimationFrame(() => {
        toPng(element, {
          backgroundColor: "#ececec",
          pixelRatio: 2,
          skipFonts: true,
          cacheBust: true,
        })
          .then(downloadImage)
          .catch(console.error);
      });
    }, 500);
  };

  return (
    <Panel position="bottom-right">
      <Button
        onClick={handleClick}
        leftIcon={<FiDownload/>}
        size="sm"
        colorScheme="blue"
      >
        Download
      </Button>
    </Panel>
  );
}
