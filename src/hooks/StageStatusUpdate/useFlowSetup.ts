import { useEffect, useCallback } from 'react';
import { useNodesState, useEdgesState, Node } from 'reactflow';
import { TemplateData } from '../../types/StageUpdate';
import { getLayoutedElements, processNodes } from '../../utils/StageUpdate';

const useFlowSetup = (
  templateData: TemplateData | null,
  handleStatusUpdate: (
    id: string,
    newStatus: string,
    passportStatus: string,
    additionalInfo: string,
    fileName: string | null,
  ) => void,
) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const processNodesWithUpdate = useCallback(
    (inputNodes: Node[]) => processNodes(inputNodes, handleStatusUpdate),
    [handleStatusUpdate],
  );

  useEffect(() => {
    if (templateData) {
      const processedNodes = processNodesWithUpdate(templateData.nodes);
      const { nodes: layoutedNodes, edges: layoutedEdges } =
        getLayoutedElements(processedNodes, templateData.edges);
      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
    }
  }, [templateData, processNodesWithUpdate, setNodes, setEdges]);

  return { nodes, edges, onNodesChange, onEdgesChange };
};

export default useFlowSetup;
