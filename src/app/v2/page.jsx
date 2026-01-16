'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Copy, Check, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

const leetMap = {
  a: ['@', '4'],
  b: ['8'],
  c: ['(', '{'],
  d: ['đ', '|)'],
  e: ['3'],
  h: ['#'],
  i: ['!', '|'],
  l: ['1', '|_'],
  o: ['0'],
  r: ['®'],
  s: ['$', '5'],
  t: ['7'],
  y: ['¥'],
};

const symbolPool = ['!', '@', '#', '$', '_', '-'];

const random = (arr) => arr[Math.floor(Math.random() * arr.length)];

export default function Home() {
  const { setTheme, theme } = useTheme();

  const [length, setLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(false);

  const [basePassword, setBasePassword] = useState('');
  const [platform, setPlatform] = useState('');
  const [smartMode, setSmartMode] = useState(false);

  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);
  const [strength, setStrength] = useState('');

  const generateRandomPassword = () => {
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()-_=+[]{};:,.<>?';

    let chars = '';
    if (includeUppercase) chars += upper;
    if (includeLowercase) chars += lower;
    if (includeNumbers) chars += numbers;
    if (includeSymbols) chars += symbols;

    if (!chars) return alert('Select at least one option');

    let pwd = '';
    for (let i = 0; i < length; i++) {
      pwd += chars[Math.floor(Math.random() * chars.length)];
    }

    setPassword(pwd);
    calculateStrength(pwd, chars.length);
  };

  const generateSmartPassword = () => {
    if (!basePassword || !platform) {
      alert('Enter base password and platform');
      return;
    }

    let result = '';

    for (const ch of basePassword) {
      const lower = ch.toLowerCase();

      if (leetMap[lower] && Math.random() > 0.35) {
        result += random(leetMap[lower]);
      } else {
        result += ch;
      }

      if (Math.random() > 0.85) {
        result += random(symbolPool);
      }
    }

    const signature =
      platform[0].toUpperCase() +
      random(['!', '#', '$']);

    result += '_' + signature;

    setPassword(result);
    calculateStrength(result, 94);
  };

  const calculateStrength = (pwd, charsetSize) => {
    const entropy = Math.log2(Math.pow(charsetSize, pwd.length));

    if (entropy < 40) setStrength('Weak');
    else if (entropy < 60) setStrength('Medium');
    else if (entropy < 80) setStrength('Strong');
    else setStrength('Very Strong');
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <main className="p-6 max-w-lg mx-auto flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">PassForge v2</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? <Sun /> : <Moon />}
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <label>Smart Mode (Leet + Platform)</label>
        <Switch checked={smartMode} onCheckedChange={setSmartMode} />
      </div>

      {smartMode ? (
        <>
          <Input
            placeholder="Base password (e.g. Riyachoudhary0110)"
            value={basePassword}
            onChange={(e) => setBasePassword(e.target.value)}
          />
          <Input
            placeholder="Platform (e.g. Discord)"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
          />
        </>
      ) : (
        <>
          <label>Password Length: {length}</label>
          <Slider min={4} max={32} step={1} onValueChange={(v) => setLength(v[0])} />

          <div className="flex justify-between"><label>Uppercase</label><Switch checked={includeUppercase} onCheckedChange={setIncludeUppercase} /></div>
          <div className="flex justify-between"><label>Lowercase</label><Switch checked={includeLowercase} onCheckedChange={setIncludeLowercase} /></div>
          <div className="flex justify-between"><label>Numbers</label><Switch checked={includeNumbers} onCheckedChange={setIncludeNumbers} /></div>
          <div className="flex justify-between"><label>Symbols</label><Switch checked={includeSymbols} onCheckedChange={setIncludeSymbols} /></div>
        </>
      )}

      <Button onClick={smartMode ? generateSmartPassword : generateRandomPassword}>
        Generate Password
      </Button>

      <div className="flex gap-2">
        <Input readOnly value={password} />
        <Button onClick={copyToClipboard} variant="outline" size="icon">
          {copied ? <Check className="text-green-500" /> : <Copy />}
        </Button>
      </div>

      {password && (
        <p className="text-sm text-muted-foreground">
          Strength: <b>{strength}</b>
        </p>
      )}
    </main>
  );
}
