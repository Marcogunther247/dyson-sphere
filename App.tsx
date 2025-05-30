import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import Button from './components/Button';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorDisplay from './components/ErrorDisplay';
import SectionWrapper from './components/SectionWrapper';
import { generateTextDescription, generateSphereImage } from './services/geminiService';
import type { ApiError } from './types';
import { IconBrain, IconImage } from './constants';

const App: React.FC = () => {
  const [description, setDescription] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isTextLoading, setIsTextLoading] = useState<boolean>(false);
  const [isImageLoading, setIsImageLoading] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);
  
  const handleGenerateDescription = useCallback(async () => {
    setIsTextLoading(true);
    setError(null);
    setDescription('');
    try {
      const text = await generateTextDescription();
      setDescription(text);
    } catch (e) {
      setError(e instanceof Error ? { message: e.message } : { message: 'An unknown error occurred.' });
    } finally {
      setIsTextLoading(false);
    }
  }, []);

  const handleGenerateImage = useCallback(async () => {
    setIsImageLoading(true);
    setError(null);
    setImageUrl('');
    try {
      const generatedImageUrl = await generateSphereImage();
      setImageUrl(generatedImageUrl);
    } catch (e) {
      setError(e instanceof Error ? { message: e.message } : { message: 'An unknown error occurred.' });
    } finally {
      setIsImageLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      <Header title="Elon Musk's Dyson Sphere Vision" />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        {!process.env.API_KEY && (
           <ErrorDisplay error={{message: "CRITICAL: API_KEY is not configured. This application requires the API_KEY environment variable to be set to function."}} />
        )}
        <ErrorDisplay error={error} />

        <SectionWrapper title="Conceptualize the Sphere">
          <div className="flex flex-col items-center space-y-6">
            <p className="text-lg text-slate-300 text-center max-w-2xl">
              Generate a visionary description of Elon Musk's hypothetical Dyson Sphere project, detailing its ambition and technological marvels.
            </p>
            <Button 
              onClick={handleGenerateDescription} 
              isLoading={isTextLoading}
              disabled={isTextLoading || !process.env.API_KEY}
              icon={<IconBrain />}
            >
              Generate Description
            </Button>
            {isTextLoading && <LoadingSpinner />}
            {description && !isTextLoading && (
              <div className="mt-6 p-6 bg-slate-850 border border-slate-700 rounded-lg shadow-inner w-full max-w-3xl prose-custom prose prose-invert prose-sm sm:prose-base">
                {description.split('\n').map((paragraph, index) => (
                  paragraph.trim() ? <p key={index}>{paragraph}</p> : null
                ))}
              </div>
            )}
          </div>
        </SectionWrapper>

        <SectionWrapper title="Visualize the Megastructure">
          <div className="flex flex-col items-center space-y-6">
            <p className="text-lg text-slate-300 text-center max-w-2xl">
              Summon an awe-inspiring visual of the Dyson Sphere, showcasing its grand scale and futuristic design.
            </p>
            <Button 
              onClick={handleGenerateImage} 
              isLoading={isImageLoading}
              disabled={isImageLoading || !process.env.API_KEY}
              icon={<IconImage />}
            >
              Generate Image
            </Button>
            {isImageLoading && <LoadingSpinner />}
            {imageUrl && !isImageLoading && (
              <div className="mt-6 p-2 sm:p-4 bg-slate-850 border border-slate-700 rounded-lg shadow-inner w-full max-w-xl sm:max-w-2xl">
                <img 
                  src={imageUrl} 
                  alt="Generated Dyson Sphere" 
                  className="rounded-md w-full h-auto object-contain"
                />
              </div>
            )}
          </div>
        </SectionWrapper>
      </main>

      <footer className="py-6 text-center bg-slate-800/50 text-slate-400 text-sm">
        <p>&copy; {new Date().getFullYear()} Dyson Sphere Vision. Powered by Gemini.</p>
        <p className="mt-1">This is a conceptual demonstration.</p>
      </footer>
    </div>
  );
};

export default App;