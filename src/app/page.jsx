'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import {
  Copy,
  Check,
  Moon,
  Sun,
  Info,
  ArrowRight,
} from 'lucide-react';
import { useTheme } from 'next-themes';


const LEET_MAP = {
  a: ['@', '4'],
  e: ['3'],
  i: ['1', '!'],
  o: ['0'],
  s: ['$', '5'],
  t: ['7'],
  l: ['1'],
};

const PLATFORM_PRESETS = {
  Discord: { symbols: ['!', '#', '_'] },
  GitHub: { symbols: ['@', '_'] },
  Banking: { symbols: ['@', '#', '$'] },
  Social: { symbols: ['!', '$', '_'] },
};

const COMMON_PATTERNS = [
  /1234/,
  /password/i,
  /qwerty/i,
  /\b(19|20)\d{2}\b/,
];


const seededRng = (seed) => {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
};

const simpleHash = (str) =>
  [...str].reduce((a, c) => a + c.charCodeAt(0), 0);

const randFromRng = (arr, rng) =>
  arr[Math.floor(rng() * arr.length)];


const computeMetrics = (pwd) => {
  const symbolCount = (pwd.match(/[^a-z0-9]/gi) || []).length;

  const memorability =
    100 - pwd.length * 1.2 - symbolCount * 2.5;

  const entropy = Math.log2(Math.pow(94, pwd.length));

  return {
    memorability: Math.max(40, Math.min(95, Math.round(memorability))),
    strength:
      entropy < 50
        ? 'Weak'
        : entropy < 70
        ? 'Strong'
        : 'Very Strong',
  };
};


export default function Home() {
  const { theme, setTheme } = useTheme();

  const [basePassword, setBasePassword] = useState('');
  const [platformPreset, setPlatformPreset] = useState('Discord');
  const [customPlatform, setCustomPlatform] = useState('');

  const [strengthDial, setStrengthDial] = useState(2);
  const [deterministic, setDeterministic] = useState(false);
  const [masterKey, setMasterKey] = useState('');

  const [password, setPassword] = useState('');
  const [generatedVariants, setGeneratedVariants] = useState({});
  const [metricsByLevel, setMetricsByLevel] = useState({});
  const [strength, setStrength] = useState('');
  const [memorability, setMemorability] = useState(0);
  const [warnings, setWarnings] = useState([]);
  const [explanation, setExplanation] = useState('');
  const [copied, setCopied] = useState(false);


  const generateVariant = (dial) => {
    const platform =
      platformPreset === 'Custom' ? customPlatform : platformPreset;

    const profile =
      PLATFORM_PRESETS[platformPreset] || PLATFORM_PRESETS.Discord;

    const seedSource = (
      basePassword.trim().toLowerCase() +
      platform.trim().toLowerCase() +
      masterKey +
      dial
    );

    const rng = deterministic
      ? seededRng(simpleHash(seedSource))
      : Math.random;

    let result = '';
    let explain = [];

    for (const ch of basePassword) {
      const lower = ch.toLowerCase();

      if (LEET_MAP[lower] && rng() > 0.4 / dial) {
        const rep = randFromRng(LEET_MAP[lower], rng);
        result += rep;
        explain.push(`${ch} → ${rep}`);
      } else {
        result += ch;
      }

      if (dial > 1 && rng() > 0.85) {
        const sym = randFromRng(profile.symbols, rng);
        result += sym;
        explain.push(`symbol ${sym}`);
      }
    }

    const signature =
      platform[0]?.toUpperCase() +
      randFromRng(['!', '#', '$'], rng);

    result += '_' + signature;

    return { result, explain };
  };


  const generatePassword = () => {
    if (!basePassword) return;

    const variants = {};
    const metrics = {};
    let warns = [];

    [1, 2, 3].forEach((lvl) => {
      const v = generateVariant(lvl);
      variants[lvl] = v;
      metrics[lvl] = computeMetrics(v.result);
    });

    COMMON_PATTERNS.forEach((p) => {
      if (p.test(basePassword))
        warns.push('Common password pattern detected');
    });

    if (basePassword.length < 8)
      warns.push('Short base password (commonly breached)');

    const currentLevel = strengthDial;

    setGeneratedVariants(variants);
    setMetricsByLevel(metrics);

    setPassword(variants[currentLevel].result);
    setExplanation(variants[currentLevel].explain.join(', '));
    setStrength(metrics[currentLevel].strength);
    setMemorability(metrics[currentLevel].memorability);
    setWarnings(warns);
  };


  const handleDialChange = (val) => {
    const lvl = val[0];
    setStrengthDial(lvl);

    if (generatedVariants[lvl] && metricsByLevel[lvl]) {
      setPassword(generatedVariants[lvl].result);
      setExplanation(generatedVariants[lvl].explain.join(', '));
      setStrength(metricsByLevel[lvl].strength);
      setMemorability(metricsByLevel[lvl].memorability);
    }
  };


  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };


  return (
    <main className="p-6 max-w-xl mx-auto flex flex-col gap-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">PassForge v3</h1>
          <p className="text-sm text-muted-foreground">
            Human-memorable · Keyboard-safe
          </p>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            setTheme(theme === 'dark' ? 'light' : 'dark')
          }
        >
          {theme === 'dark' ? <Sun /> : <Moon />}
        </Button>
      </header>

      <section className="flex flex-col gap-3">
        <Input
          placeholder="Base password (memorable)"
          value={basePassword}
          onChange={(e) => setBasePassword(e.target.value)}
        />

        <select
          className="border rounded-md px-3 py-2 bg-background"
          value={platformPreset}
          onChange={(e) => setPlatformPreset(e.target.value)}
        >
          {Object.keys(PLATFORM_PRESETS).map((p) => (
            <option key={p}>{p}</option>
          ))}
          <option value="Custom">Custom</option>
        </select>

        {platformPreset === 'Custom' && (
          <Input
            placeholder="Custom platform name"
            value={customPlatform}
            onChange={(e) => setCustomPlatform(e.target.value)}
          />
        )}
      </section>

      <section className="flex flex-col gap-4">
        <label className="text-sm font-medium">
          Strength Dial (preview enabled): {strengthDial}
        </label>
        <Slider
          min={1}
          max={3}
          step={1}
          defaultValue={[2]}
          onValueChange={handleDialChange}
        />

        <div className="flex justify-between items-center">
          <label className="text-sm">
            Deterministic Recovery Mode
          </label>
          <Switch
            checked={deterministic}
            onCheckedChange={setDeterministic}
          />
        </div>

        {deterministic && (
          <Input
            placeholder="Master key (required for recovery)"
            value={masterKey}
            onChange={(e) => setMasterKey(e.target.value)}
          />
        )}
      </section>

      <Button onClick={generatePassword}>
        Generate Password
      </Button>

      <section className="flex gap-2">
        <Input readOnly value={password} />
        <Button
          onClick={copyToClipboard}
          variant="outline"
          size="icon"
        >
          {copied ? (
            <Check className="text-green-500" />
          ) : (
            <Copy />
          )}
        </Button>
      </section>

      {password && (
        <section className="text-sm flex flex-col gap-2">
          <p><b>Strength:</b> {strength}</p>
          <p><b>Memorability:</b> {memorability}%</p>
          <p><b>Typability:</b> 100%</p>

          {warnings.length > 0 && (
            <div className="rounded-md border border-yellow-500/30 bg-yellow-500/10 p-3">
              {warnings.map((w, i) => (
                <p key={i}>⚠ {w}</p>
              ))}
            </div>
          )}

          <details>
            <summary className="cursor-pointer flex items-center gap-1">
              <Info size={14} /> Explain my password
            </summary>
            <p className="mt-2 text-muted-foreground">
              {explanation}
            </p>
          </details>
        </section>
      )}

      <footer className="pt-4 border-t text-sm flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">
            Prefer the classic generator?
          </span>
          <Link
            href="/v2"
            className="flex items-center gap-1 text-primary hover:underline"
          >
            Go to v2 <ArrowRight size={14} />
          </Link>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Passwords never leave your device
        </p>
      </footer>
    </main>
  );
}
