import { useState, useCallback, useEffect } from 'react';
import { TemplateData } from '../../types/StageUpdate';

const useTemplateData = () => {
  const [templateData, setTemplateData] = useState<TemplateData | null>(null);

  const handleStatusUpdate = useCallback(
    (
      id: string,
      newStatus: string,
      passportStatus: string,
      additionalInfo: string,
      fileName: string | null,
    ) => {
      setTemplateData((prevData) => {
        if (!prevData) return null;

        const updatedNodes = prevData.nodes.map((node) => {
          if (node.id === id) {
            return {
              ...node,
              data: {
                ...node.data,
                status: newStatus,
                passportStatus,
                additionalInfo,
                fileName,
              },
            };
          }
          return node;
        });

        const updatedData = {
          ...prevData,
          nodes: updatedNodes,
        };

        console.log(JSON.stringify(updatedData, null, 2));
        return updatedData;
      });
    },
    [],
  );

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'TEMPLATE_DATA') {
        setTemplateData(event.data.payload);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return { templateData, handleStatusUpdate };
};

export default useTemplateData;
