import React, { useRef, useEffect, useState } from 'react';
import { ScheduleItem } from '../../../types/index';

interface ActivityProps {
    item: ScheduleItem;
    onClose: () => void;
    onFinish: () => void;
}

const ArtActivity: React.FC<ActivityProps> = ({ item, onClose, onFinish }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);

    const getCanvasContext = () => {
        const canvas = canvasRef.current;
        if (!canvas) return null;
        return canvas.getContext('2d');
    };

    useEffect(() => {
        const ctx = getCanvasContext();
        if (ctx) {
            ctx.fillStyle = '#171717'; // neutral-900
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        }
    }, []);

    const startDrawing = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
        const { offsetX, offsetY } = nativeEvent;
        const ctx = getCanvasContext();
        if (ctx) {
            ctx.beginPath();
            ctx.moveTo(offsetX, offsetY);
            setIsDrawing(true);
        }
    };

    const draw = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;
        const { offsetX, offsetY } = nativeEvent;
        const ctx = getCanvasContext();
        if (ctx) {
            ctx.lineTo(offsetX, offsetY);
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 5;
            ctx.lineCap = 'round';
            ctx.stroke();
        }
    };

    const stopDrawing = () => {
        const ctx = getCanvasContext();
        if (ctx) {
            ctx.closePath();
            setIsDrawing(false);
        }
    };

    const clearCanvas = () => {
        const ctx = getCanvasContext();
        if (ctx) {
            ctx.fillStyle = '#171717';
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-neutral-800 border-4 border-dotted border-neutral-600 rounded-2xl w-full max-w-3xl text-center p-6 flex flex-col items-center gap-4">
                 <h1 className="text-3xl font-bold text-cyan-300">Draw a Friendly Alien</h1>
                 <p className="text-neutral-300 max-w-xl">{item.content}</p>

                <canvas
                    ref={canvasRef}
                    width="600"
                    height="400"
                    className="bg-neutral-900 rounded-lg cursor-crosshair"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                />

                <div className="flex w-full justify-center gap-4 mt-2">
                    <button onClick={clearCanvas} className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors">
                        Clear Canvas
                    </button>
                     <button onClick={onFinish} className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors">
                        I'm Finished!
                    </button>
                </div>
            </div>
        </div>
    );
};
export default ArtActivity;
