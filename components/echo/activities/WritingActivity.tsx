import React, { useRef, useEffect, useState } from 'react';
import { ScheduleItem } from '../../../types/index';

interface ActivityProps {
    item: ScheduleItem;
    onClose: () => void;
    onFinish: () => void;
}

const WritingActivity: React.FC<ActivityProps> = ({ item, onClose, onFinish }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);

    const getCanvasContext = () => canvasRef.current?.getContext('2d');

    useEffect(() => {
        const ctx = getCanvasContext();
        if (ctx) {
            ctx.fillStyle = '#262626'; // neutral-800
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
            ctx.fillStyle = '#262626';
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-neutral-900 border-4 border-dotted border-neutral-700 rounded-2xl w-full max-w-4xl text-center p-8 flex flex-col items-center gap-6">
                <h1 className="text-4xl font-bold text-cyan-300">Let's Write Our Name</h1>
                <p className="text-lg text-neutral-300">{item.content}</p>

                <div className="flex w-full justify-center gap-8">
                    <div className="flex flex-col items-center gap-2">
                         <h2 className="font-semibold">Draw or write here</h2>
                         <canvas
                            ref={canvasRef}
                            width="400"
                            height="300"
                            className="bg-neutral-800 rounded-lg cursor-crosshair border-2 border-neutral-600"
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={stopDrawing}
                            onMouseLeave={stopDrawing}
                        />
                        <button onClick={clearCanvas} className="w-full mt-2 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors">
                            Clear Sketchpad
                        </button>
                    </div>
                     <div className="flex flex-col items-center gap-2">
                        <h2 className="font-semibold">Or type here</h2>
                         <textarea
                            className="w-full h-[300px] bg-neutral-800 rounded-lg border-2 border-cyan-400 p-4 text-2xl font-mono focus:outline-none focus:ring-2 focus:ring-cyan-300 resize-none"
                            style={{width: '400px'}}
                        />
                    </div>
                </div>

                <button onClick={onFinish} className="w-full max-w-lg mt-6 py-4 bg-green-600 text-white text-2xl font-bold rounded-full hover:bg-green-700 transition-transform hover:scale-105">
                    I'm Finished!
                </button>
            </div>
        </div>
    );
};
export default WritingActivity;
