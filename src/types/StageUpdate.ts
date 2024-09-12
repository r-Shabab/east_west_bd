import { Node, Edge } from 'reactflow';

export interface TemplateData {
  templateId: string;
  templateName: string;
  nodes: Node[];
  edges: Edge[];
}
