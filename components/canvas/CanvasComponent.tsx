import React, { useState, useCallback, useEffect, ForwardedRef, useMemo, useRef } from 'react';
import type { NodeData, Edge, DynamicNodeConfig, Point, Port } from '../../types/index';
import NodeComponent from './NodeComponent';
import { MIN_ZOOM, MAX_ZOOM, ZOOM_SENSITIVITY, DATA_TYPE_STROKE_COLORS, DEFAULT_EDGE_COLOR } from '../../core/constants';
import { PlusIcon } from '../icons';

interface CanvasComponentProps {
  nodes: NodeData[];
  edges: Edge[];
  onNodeDrag: (nodeId: string, x: number, y: number) => void;
  setNodes: React.Dispatch<React.SetStateAction<NodeData[]>>;
  onAddEdge: (edge: Edge) => void;
  onInteractionEnd: () => void;
  executeNode: (nodeId: string) => Promise<NodeData['status']>;
  updateNodeInternalState: (nodeId: string, dataChanges: Partial<NodeData['data']>, status?: NodeData['status'], error?: string | null, executionTime?: string) => void;
  onRemoveNode: (nodeId: string) => void;
  appMode: 'studio' | 'sandbox' | 'echo';
  onRequestReview: (nodeId: string) => Promise<void>;
  onViewTransformChange: (transform: { x: number, y: number, k: number }) => void;
  highlightedNodeId?: string | null;
  activeDrawingToolNodeId: string | null;
  setActiveDrawingToolNodeId: (nodeId: string | null) => void;
  isWorkflowRunning: boolean;
  onRemoveEdge: (edgeId: string) => void;
  onAddNode: (agentConfig: DynamicNodeConfig, worldPoint: Point) => void;
}

const getPortKey = (nodeId: string, portId: string) => `${nodeId}__${portId}`;

const CanvasComponent = React.forwardRef<HTMLDivElement, CanvasComponentProps>(
  (props, ref: ForwardedRef<HTMLDivElement>) => {
    const { nodes, edges, onNodeDrag, setNodes, onAddEdge, onInteractionEnd, executeNode, updateNodeInternalState, onRemoveNode, onRemoveEdge, onViewTransformChange, highlightedNodeId, activeDrawingToolNodeId, setActiveDrawingToolNodeId, appMode, onRequestReview, isWorkflowRunning, onAddNode } = props;

    const [viewTransform, setViewTransform] = useState({ x: 0, y: 0, k: 1 });
    const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
    const [dragStartPoint, setDragStartPoint] = useState({ x: 0, y: 0 });
    const [isConnecting, setIsConnecting] = useState(false);
    const [connectionStart, setConnectionStart] = useState<{ nodeId: string; port: Port } | null>(null);
    const [tempEdge, setTempEdge] = useState<[Point, Point] | null>(null);

    const portPositions = useRef(new Map<string, Point>());

    const screenToWorld = useCallback((screenX: number, screenY: number): Point => {
      const canvas = (ref as React.RefObject<HTMLDivElement>)?.current;
      if (!canvas) return { x: screenX, y: screenY };
      const rect = canvas.getBoundingClientRect();
      return {
        x: (screenX - rect.left - viewTransform.x) / viewTransform.k,
        y: (screenY - rect.top - viewTransform.y) / viewTransform.k,
      };
    }, [ref, viewTransform]);

    const handleWheel = useCallback((e: WheelEvent) => {
      e.preventDefault();
      const canvas = (ref as React.RefObject<HTMLDivElement>)?.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const pointerX = e.clientX - rect.left;
      const pointerY = e.clientY - rect.top;
      const delta = e.deltaY * -ZOOM_SENSITIVITY;
      const newScale = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, viewTransform.k * (1 + delta)));

      const mouseX = (pointerX - viewTransform.x) / viewTransform.k;
      const mouseY = (pointerY - viewTransform.y) / viewTransform.k;
      const newX = pointerX - mouseX * newScale;
      const newY = pointerY - mouseY * newScale;

      setViewTransform({ x: newX, y: newY, k: newScale });
    }, [ref, viewTransform]);

    useEffect(() => {
        const canvas = (ref as React.RefObject<HTMLDivElement>)?.current;
        if (canvas) {
            canvas.addEventListener('wheel', handleWheel, { passive: false });
            return () => canvas.removeEventListener('wheel', handleWheel);
        }
    }, [ref, handleWheel]);

    const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
      if (e.button === 1 || e.button === 2) {
        setIsDraggingCanvas(true);
        setDragStartPoint({ x: e.clientX - viewTransform.x, y: e.clientY - viewTransform.y });
        e.currentTarget.style.cursor = 'grabbing';
      }
    }, [viewTransform]);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
      if (isDraggingCanvas) {
        setViewTransform(prev => ({ ...prev, x: e.clientX - dragStartPoint.x, y: e.clientY - dragStartPoint.y }));
      }
      if (isConnecting && connectionStart) {
        const startPos = portPositions.current.get(getPortKey(connectionStart.nodeId, connectionStart.port.id));
        if (startPos) {
          const endPos = screenToWorld(e.clientX, e.clientY);
          setTempEdge(connectionStart.port.type === 'output' ? [startPos, endPos] : [endPos, startPos]);
        }
      }
    }, [isDraggingCanvas, dragStartPoint, isConnecting, connectionStart, screenToWorld]);

    const handleMouseUp = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
      if (isDraggingCanvas) {
        setIsDraggingCanvas(false);
        e.currentTarget.style.cursor = 'default';
        onInteractionEnd();
      }
      if (isConnecting) {
        setIsConnecting(false);
        setConnectionStart(null);
        setTempEdge(null);
      }
    }, [isDraggingCanvas, isConnecting, onInteractionEnd]);

    const getEdgePath = useCallback((startPos: Point, endPos: Point) => {
      const dx = endPos.x - startPos.x;
      const curveX = dx * 0.5;
      return `M ${startPos.x} ${startPos.y} C ${startPos.x + curveX} ${startPos.y}, ${endPos.x - curveX} ${endPos.y}, ${endPos.x} ${endPos.y}`;
    }, []);

    return (
      <div
        ref={ref}
        className="w-full h-full bg-brand-dark overflow-hidden relative"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onContextMenu={(e) => e.preventDefault()}
        style={{
          backgroundSize: `${20 * viewTransform.k}px ${20 * viewTransform.k}px`,
          backgroundPosition: `${viewTransform.x}px ${viewTransform.y}px`,
          backgroundImage: 'radial-gradient(circle, #30363D 1px, transparent 1px)',
        }}
      >
        <div
          className="transform-group"
          style={{ transform: `translate(${viewTransform.x}px, ${viewTransform.y}px) scale(${viewTransform.k})` }}
        >
          <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ width: '1000vw', height: '1000vh' }}>
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#6b7280" />
              </marker>
            </defs>
            {edges.map(edge => {
              const sourcePos = portPositions.current.get(getPortKey(edge.sourceNodeId, edge.sourceOutputId));
              const targetPos = portPositions.current.get(getPortKey(edge.targetNodeId, edge.targetInputId));
              if (!sourcePos || !targetPos) return null;
              return (
                <path
                  key={edge.id}
                  d={getEdgePath(sourcePos, targetPos)}
                  stroke={DEFAULT_EDGE_COLOR}
                  strokeWidth="2"
                  fill="none"
                  className="pointer-events-auto"
                  onDoubleClick={() => onRemoveEdge(edge.id)}
                />
              );
            })}
            {tempEdge && (
              <path d={getEdgePath(tempEdge[0], tempEdge[1])} stroke="#f59e0b" strokeWidth="2" fill="none" />
            )}
          </svg>
          {nodes.map(node => (
            <NodeComponent
              key={node.id}
              node={node}
              executeNode={executeNode}
              updateNodeInternalState={(nodeId, data) => updateNodeInternalState(nodeId, data)}
              onCloseNode={onRemoveNode}
              isHighlighted={highlightedNodeId === node.id}
              activeDrawingToolNodeId={activeDrawingToolNodeId}
              setActiveDrawingToolNodeId={setActiveDrawingToolNodeId}
              appMode={appMode}
              onRequestReview={onRequestReview}
            />
          ))}
        </div>
      </div>
    );
  }
);
CanvasComponent.displayName = 'CanvasComponent';
export default CanvasComponent;