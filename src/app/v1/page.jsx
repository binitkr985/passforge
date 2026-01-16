'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Copy, Check, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function Home() {
  const [length, setLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(false);
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);
  const [strength, setStrength] = useState('');
  const { setTheme, theme } = useTheme();

  const generatePassword = () => {
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()-_=+[]{};:,.<>?';

    let validChars = '';
    if (includeUppercase) validChars += upper;
    if (includeLowercase) validChars += lower;
    if (includeNumbers) validChars += numbers;
    if (includeSymbols) validChars += symbols;

    if (validChars.length === 0) {
      alert('Select at least one option');
      return;
    }

    let generated = '';
    for (let i = 0; i < length; i++) {
      const index = Math.floor(Math.random() * validChars.length);
      generated += validChars[index];
    }

    setPassword(generated);
    calculateStrength(generated, validChars.length);
  };

  const calculateStrength = (pwd, charsetSize) => {
    const entropy = Math.log2(Math.pow(charsetSize, pwd.length));
    const secondsToCrack = Math.pow(2, entropy) / 1e10;

    if (entropy < 40) setStrength('Weak');
    else if (entropy < 60) setStrength('Medium');
    else if (entropy < 80) setStrength('Strong');
    else setStrength('Very Strong');

    const time = secondsToCrack > 3.154e7
      ? `${(secondsToCrack / 3.154e7).toFixed(1)} years`
      : `${(secondsToCrack).toFixed(1)} seconds`;

    setStrength((prev) => `${prev} (🔓 ~${time} to bruteforce)`);
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <main className="p-6 max-w-lg mx-auto flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">PassForge - Password Generator</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? <Sun /> : <Moon />}
        </Button>
      </div>

      <div>
        <label>Password Length: {length}</label>
        <Slider
          defaultValue={[length]}
          min={4}
          max={32}
          step={1}
          onValueChange={(val) => setLength(val[0])}
        />
      </div>

      <div className="flex items-center justify-between">
        <label>Include Uppercase</label>
        <Switch checked={includeUppercase} onCheckedChange={setIncludeUppercase} />
      </div>

      <div className="flex items-center justify-between">
        <label>Include Lowercase</label>
        <Switch checked={includeLowercase} onCheckedChange={setIncludeLowercase} />
      </div>

      <div className="flex items-center justify-between">
        <label>Include Numbers</label>
        <Switch checked={includeNumbers} onCheckedChange={setIncludeNumbers} />
      </div>

      <div className="flex items-center justify-between">
        <label>Include Symbols</label>
        <Switch checked={includeSymbols} onCheckedChange={setIncludeSymbols} />
      </div>

      <Button onClick={generatePassword}>Generate Password</Button>

      <div className="flex gap-2 items-center">
        <Input value={password} onClick={password ? copyToClipboard : undefined} className={password ? "cursor-pointer" : ""} readOnly />
        <Button onClick={copyToClipboard} variant="outline" size="icon">
          {copied ? <Check className="text-green-500" /> : <Copy />}
        </Button>
      </div>

      {password && (
        <p className="text-sm text-muted-foreground">
          Strength: <span className="font-semibold">{strength}</span>
        </p>
      )}
    </main>
  );
}
