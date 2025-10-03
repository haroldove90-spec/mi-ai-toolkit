import React, { useState, useCallback } from 'react';
import { generateStructuredText } from '../../services/geminiService';
import type { Tool } from '../../types';
import Spinner from '../ui/Spinner';
import { Type } from '@google/genai';

interface BrandNameGeneratorProps {
    tool: Tool;
    onBack: () => void;
}

const BrandNameGenerator: React.FC<BrandNameGeneratorProps> = ({ tool, onBack }) => {
    const [description, setDescription] = useState('');
    const [keywords, setKeywords] = useState('');
    const [tone, setTone] = useState('Profesional');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<{ brandNames: string[], slogans: string[] } | null>(null);

    const handleGenerate = useCallback(async () => {
        if (!description.trim()) {
            setError('Por favor, describe el producto o servicio.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setResult(null);
        try {
            const prompt = `Generate 5 brand name ideas and 3 slogan ideas for a product/service. Product description: '${description}'. Keywords: '${keywords}'. The desired tone is '${tone}'.`;
            const schema = {
                type: Type.OBJECT,
                properties: {
                    brandNames: {
                        type: Type.ARRAY,
                        description: "An array of 5 creative brand names.",
                        items: { type: Type.STRING }
                    },
                    slogans: {
                        type: Type.ARRAY,
                        description: "An array of 3 catchy slogans.",
                        items: { type: Type.STRING }
                    }
                },
                required: ["brandNames", "slogans"]
            };
            const response = await generateStructuredText(prompt, schema);
            setResult(response);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [description, keywords, tone]);

    return (
        <div className="max-w-3xl mx-auto">
            <button onClick={onBack} className="mb-6 text-purple-400 hover:text-purple-300">&larr; Volver al Dashboard</button>
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold">{tool.title}</h2>
                <p className="text-gray-400 mt-2">{tool.description}</p>
            </div>

            <div className="mt-6 mb-8 p-4 bg-gray-800 border border-gray-700 rounded-lg text-center">
                <p className="text-sm text-gray-300">
                    <span className="font-semibold text-purple-400">¿Cómo funciona?</span> Describe tu producto, añade palabras clave y elige un tono. La IA generará nombres de marca y slogans creativos para inspirarte en tu próximo proyecto de branding.
                </p>
            </div>

            <div className="space-y-4 bg-gray-800/50 p-6 rounded-lg">
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descripción del Producto/Servicio (ej: Una app de café artesanal a domicilio)"
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    rows={3}
                    disabled={isLoading}
                />
                 <input
                    type="text"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="Palabras Clave (ej: rápido, fresco, premium)"
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    disabled={isLoading}
                />
                 <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    disabled={isLoading}
                >
                    <option>Profesional</option>
                    <option>Divertido</option>
                    <option>Moderno</option>
                    <option>Lujoso</option>
                    <option>Minimalista</option>
                </select>
                <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="w-full flex justify-center items-center bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold py-3 px-4 rounded-lg hover:opacity-90 disabled:opacity-50"
                >
                    {isLoading && <Spinner />}
                    {isLoading ? 'Generando Ideas...' : 'Generar Nombres y Slogans'}
                </button>
            </div>

            {error && <div className="mt-6 p-4 bg-red-500/20 text-red-300 border border-red-500/30 rounded-lg">{error}</div>}
            
            <div className="mt-8">
                {isLoading && <p className="text-center text-gray-400">Buscando inspiración...</p>}
                {result && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-gray-800 p-6 rounded-lg">
                           <h3 className="text-xl font-semibold mb-4 text-purple-400">Nombres de Marca</h3>
                           <ul className="space-y-2 list-disc list-inside text-gray-300">
                               {result.brandNames.map((name, index) => <li key={index}>{name}</li>)}
                           </ul>
                        </div>
                         <div className="bg-gray-800 p-6 rounded-lg">
                           <h3 className="text-xl font-semibold mb-4 text-purple-400">Slogans</h3>
                            <ul className="space-y-2 list-disc list-inside text-gray-300">
                               {result.slogans.map((slogan, index) => <li key={index}>{slogan}</li>)}
                           </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BrandNameGenerator;