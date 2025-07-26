'use client';

import { ThemeToggle } from '../../src/src/components/ui/ThemeToggle';

export default function ThemeDemoPage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Theme Toggle Demo</h1>
          <ThemeToggle />
        </div>
        
        <div className="grid gap-6">
          {/* Cards section */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card text-card-foreground p-6 rounded-lg border border-border">
              <h2 className="text-xl font-semibold mb-4">Card Example</h2>
              <p className="text-muted-foreground">
                This card demonstrates how components look in both light and dark themes.
              </p>
            </div>
            
            <div className="bg-secondary text-secondary-foreground p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Secondary Card</h2>
              <p>
                Secondary background with appropriate text contrast.
              </p>
            </div>
          </div>
          
          {/* Buttons section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Interactive Elements</h2>
            <div className="flex gap-4 flex-wrap">
              <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
                Primary Button
              </button>
              <button className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
                Secondary Button
              </button>
              <button className="bg-destructive text-destructive-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
                Destructive Button
              </button>
            </div>
          </div>
          
          {/* Form elements */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Form Elements</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Enter text here..."
                className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
              />
              <select className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent">
                <option>Select an option</option>
                <option>Option 1</option>
                <option>Option 2</option>
                <option>Option 3</option>
              </select>
            </div>
          </div>
          
          {/* Text examples */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Text Examples</h2>
            <div className="space-y-2">
              <p className="text-foreground">Regular text with good contrast</p>
              <p className="text-muted-foreground">Muted text for secondary information</p>
              <p className="text-primary">Primary colored text</p>
              <p className="text-destructive">Destructive colored text</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 