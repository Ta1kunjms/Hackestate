'use client';

import { ThemeToggle } from '../../src/src/components/ui/ThemeToggle';

export default function TestThemePage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Theme Test Page</h1>
          <ThemeToggle />
        </div>
        
        <div className="space-y-6">
          <div className="bg-card text-card-foreground p-6 rounded-lg border border-border">
            <h2 className="text-xl font-semibold mb-4">Test Card</h2>
            <p className="text-muted-foreground">
              This page demonstrates the theme toggle. Click the sun/moon icon in the top right to switch between light and dark themes.
            </p>
          </div>
          
          <div className="bg-secondary text-secondary-foreground p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Secondary Background</h2>
            <p>This uses the secondary background color.</p>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Text Examples</h2>
            <p className="text-foreground">Regular text</p>
            <p className="text-muted-foreground">Muted text</p>
            <p className="text-primary">Primary colored text</p>
            <p className="text-destructive">Destructive colored text</p>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Buttons</h2>
            <div className="flex gap-4 flex-wrap">
              <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
                Primary Button
              </button>
              <button className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
                Secondary Button
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 