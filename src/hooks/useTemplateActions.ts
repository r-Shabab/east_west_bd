import { useState } from 'react';
import { toast } from 'react-toastify';

const useTemplateActions = (
  reactFlowInstance: any,
  nodes: any,
  setNodes: any,
  setEdges: any,
  initialNodes: any,
) => {
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'save' | 'cancel' | null>(
    null,
  );
  const [templateName, setTemplateName] = useState('');

  const openConfirmDialog = (action: 'save' | 'cancel') => {
    setConfirmAction(action);
    setIsConfirmDialogOpen(true);
  };

  const closeConfirmDialog = () => {
    setIsConfirmDialogOpen(false);
    setConfirmAction(null);
    setTemplateName('');
  };

  const handleSave = () => {
    if (nodes.length === 0) {
      toast.error('Cannot save an empty canvas.', { position: 'top-right' });
      return;
    }
    const flow = reactFlowInstance.toObject();
    const filteredFlow = {
      nodes: flow.nodes.map(
        (node: { id: any; type: any; data: any; position: any }) => ({
          id: node.id,
          type: node.type,
          data: node.data,
          position: node.position,
        }),
      ),
      edges: flow.edges.map(
        (edge: { id: any; source: any; target: any; type: any }) => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
          type: edge.type,
        }),
      ),
    };
    console.log(JSON.stringify(filteredFlow, null, 2));
    toast.success(`Template "${templateName}" saved successfully.`, {
      position: 'top-right',
    });
  };

  const handleCancel = () => {
    setNodes([]);
    setEdges([]);
    toast.warning('Changes discarded.', { position: 'top-right' });
  };

  return {
    openConfirmDialog,
    closeConfirmDialog,
    handleSave,
    handleCancel,
    isConfirmDialogOpen,
    confirmAction,
    setTemplateName,
    templateName,
  };
};

export default useTemplateActions;
