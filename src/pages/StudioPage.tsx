import { useState, useRef, useCallback } from 'react'
import { toPng, toJpeg } from 'html-to-image'
import {
  Download, Upload, RefreshCw, Image as ImageIcon,
  Sliders, Lock, Unlock, Crown, Save
} from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import { useExportLimit } from '../hooks/useExportLimit'
import ExportGateModal from '../components/ui/ExportGateModal'
import { useSaveExport } from '../hooks/useSaveExport'

// ── Types ──────────────────────────────────────────────────────────────────
type BgType = 'gradient' | 'solid' | 'mesh'
type ExportFormat = 'png' | 'jpeg'
type Scale = 1 | 2 | 3

interface StudioSettings {
  bgType: BgType
  bgGradient: string
  bgSolid: string
  paddingX: number
  paddingY: number
  borderRadius: number
  shadowIntensity: number
  showBrowserFrame: boolean
  exportFormat: ExportFormat
  exportScale: Scale
}

// ── Preset Gradients ───────────────────────────────────────────────────────
const GRADIENTS = [
  { label: 'Cosmos', value: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)' },
  { label: 'Aurora', value: 'linear-gradient(135deg, #005c97, #363795)' },
  { label: 'Ember', value: 'linear-gradient(135deg, #e96443, #904e95)' },
  { label: 'Forest', value: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)' },
  { label: 'Candy', value: 'linear-gradient(135deg, #f953c6, #b91d73)' },
  { label: 'Gold', value: 'linear-gradient(135deg, #f7971e, #ffd200)' },
  { label: 'Mint', value: 'linear-gradient(135deg, #0acffe, #495aff)' },
  { label: 'Rose', value: 'linear-gradient(135deg, #f43b47, #453a94)' },
]

const MESH_GRADIENTS = [
  { label: 'Purple Mesh', value: 'radial-gradient(at 40% 20%, #7c6af7 0px, transparent 50%), radial-gradient(at 80% 0%, #5b21b6 0px, transparent 50%), radial-gradient(at 0% 50%, #4338ca 0px, transparent 50%), radial-gradient(at 80% 50%, #1e1b4b 0px, transparent 50%), radial-gradient(at 0% 100%, #312e81 0px, transparent 50%), #050507' },
  { label: 'Ocean Mesh', value: 'radial-gradient(at 40% 20%, #0ea5e9 0px, transparent 50%), radial-gradient(at 80% 0%, #0284c7 0px, transparent 50%), radial-gradient(at 0% 50%, #0369a1 0px, transparent 50%), #050507' },
  { label: 'Sunset Mesh', value: 'radial-gradient(at 40% 20%, #f59e0b 0px, transparent 50%), radial-gradient(at 80% 0%, #ef4444 0px, transparent 50%), radial-gradient(at 0% 50%, #b45309 0px, transparent 50%), #0c0a09' },
]

// ── Default settings ───────────────────────────────────────────────────────
const defaultSettings: StudioSettings = {
  bgType: 'gradient',
  bgGradient: GRADIENTS[0].value,
  bgSolid: '#1a1a2e',
  paddingX: 48,
  paddingY: 48,
  borderRadius: 12,
  shadowIntensity: 60,
  showBrowserFrame: true,
  exportFormat: 'png',
  exportScale: 2,
}

// ── Helpers ────────────────────────────────────────────────────────────────
function computeBackground(s: StudioSettings): string {
  if (s.bgType === 'solid') return s.bgSolid
  if (s.bgType === 'mesh') return MESH_GRADIENTS[0].value
  return s.bgGradient
}

// ── SectionHeader ──────────────────────────────────────────────────────────
function SectionHeader({ title }: { title: string }) {
  return (
    <p className="text-text-dim text-xs font-display font-semibold uppercase tracking-widest mb-3">
      {title}
    </p>
  )
}

// ── SliderControl ──────────────────────────────────────────────────────────
function SliderControl({
  label, value, min, max, step = 1, unit = 'px', onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step?: number
  unit?: string
  onChange: (v: number) => void
}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-text-secondary text-xs">{label}</label>
        <span className="text-accent text-xs font-mono">{value}{unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 appearance-none rounded-full bg-border cursor-pointer
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:w-3.5
          [&::-webkit-slider-thumb]:h-3.5
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-accent
          [&::-webkit-slider-thumb]:cursor-pointer
          [&::-webkit-slider-thumb]:shadow-glow-accent"
      />
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function StudioPage() {
  const [settings, setSettings] = useState<StudioSettings>(defaultSettings)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [exporting, setExporting] = useState(false)
  const [lockPadding, setLockPadding] = useState(true)
  const [selectedGradientIdx, setSelectedGradientIdx] = useState(0)
  const [selectedMeshIdx, setSelectedMeshIdx] = useState(0)
  const [gateModal, setGateModal] = useState<'limit_reached' | 'not_logged_in' | null>(null)
  const [lastExportDataUrl, setLastExportDataUrl] = useState<string | null>(null)
  const [savedToAccount, setSavedToAccount] = useState(false)

  const canvasRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { isLoggedIn, isPro, canExport, remaining, recordExport } = useExportLimit()
  const { saving, saveExport } = useSaveExport()

  const update = useCallback(<K extends keyof StudioSettings>(key: K, value: StudioSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }, [])

  // ── Computed styles — defined here so JSX can use them ─────────────────
  const background = computeBackground(settings)
  const shadow = `0 ${settings.shadowIntensity * 0.5}px ${settings.shadowIntensity * 2}px rgba(0,0,0,${settings.shadowIntensity / 100})`

  // ── Upload ─────────────────────────────────────────────────────────────
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setUploadedImage(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (ev) => setUploadedImage(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  // ── Export ─────────────────────────────────────────────────────────────
  const handleExport = async () => {
    if (!isLoggedIn) {
      setGateModal('not_logged_in')
      return
    }
    if (!canExport) {
      setGateModal('limit_reached')
      return
    }
    if (!canvasRef.current) return

    setExporting(true)
    setSavedToAccount(false)
    try {
      const opts = { pixelRatio: settings.exportScale, cacheBust: true }
      const dataUrl =
        settings.exportFormat === 'jpeg'
          ? await toJpeg(canvasRef.current, { ...opts, quality: 0.95 })
          : await toPng(canvasRef.current, opts)

      const link = document.createElement('a')
      link.href = dataUrl
      link.download = `screenshot-studio-export.${settings.exportFormat}`
      link.click()

      setLastExportDataUrl(dataUrl)
      await recordExport()
    } catch (err) {
      console.error('Export failed:', err)
    } finally {
      setExporting(false)
    }
  }

  // ── Save to account ────────────────────────────────────────────────────
  const handleSaveToAccount = async () => {
    if (!lastExportDataUrl) return
    const { error } = await saveExport({
      dataUrl: lastExportDataUrl,
      format: settings.exportFormat,
    })
    if (!error) {
      setSavedToAccount(true)
      setLastExportDataUrl(null)
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-void flex flex-col">

      {/* Gate Modal */}
      {gateModal && (
        <ExportGateModal
          reason={gateModal}
          onClose={() => setGateModal(null)}
        />
      )}

      {/* Status Bar */}
      {isLoggedIn && !isPro && (
        <div className="pt-16 w-full bg-surface border-b border-border px-6 py-2 flex items-center justify-center gap-3 text-xs">
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className={`w-5 h-1.5 rounded-full transition-all ${
                  i < (5 - remaining) ? 'bg-accent' : 'bg-border'
                }`}
              />
            ))}
          </div>
          <span className="text-text-secondary">
            <span className="text-text-primary font-medium">{remaining}</span> of 5 free exports remaining today
          </span>
          <Link to="/pricing" className="text-accent hover:text-accent-light font-medium transition-colors">
            Upgrade →
          </Link>
        </div>
      )}

      {isLoggedIn && isPro && (
        <div className="pt-16 w-full bg-gold/5 border-b border-gold/10 px-6 py-2 flex items-center justify-center gap-2 text-xs">
          <Crown size={12} className="text-gold" />
          <span className="text-gold font-medium">Pro — Unlimited exports active</span>
        </div>
      )}

      {!isLoggedIn && (
        <div className="pt-16 w-full bg-surface border-b border-border px-6 py-2 flex items-center justify-center gap-3 text-xs">
          <span className="text-text-secondary">Sign in to export your screenshots</span>
          <Link to="/signup" className="text-accent hover:text-accent-light font-medium transition-colors">
            Create free account →
          </Link>
        </div>
      )}

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row flex-1">

        {/* Sidebar Controls */}
        <aside className="w-full lg:w-80 xl:w-88 border-b lg:border-b-0 lg:border-r border-border bg-panel overflow-y-auto shrink-0">
          <div className="p-5 space-y-7">

            {/* Header */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <Sliders size={16} className="text-accent" />
                <span className="font-display font-semibold text-text-primary text-sm">Controls</span>
              </div>
              <Badge variant="subtle">v1.0</Badge>
            </div>

            {/* Background Type */}
            <div>
              <SectionHeader title="Background" />
              <div className="grid grid-cols-3 gap-2 mb-4">
                {(['gradient', 'mesh', 'solid'] as BgType[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => update('bgType', t)}
                    className={`py-2 rounded-lg text-xs font-medium capitalize transition-all ${
                      settings.bgType === t
                        ? 'bg-accent text-white border border-accent'
                        : 'bg-surface text-text-secondary border border-border hover:border-accent/30'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {settings.bgType === 'gradient' && (
                <div className="grid grid-cols-4 gap-2">
                  {GRADIENTS.map((g, i) => (
                    <button
                      key={i}
                      title={g.label}
                      onClick={() => {
                        setSelectedGradientIdx(i)
                        update('bgGradient', g.value)
                      }}
                      className={`h-8 rounded-lg transition-all ${
                        selectedGradientIdx === i
                          ? 'ring-2 ring-accent ring-offset-1 ring-offset-panel scale-105'
                          : 'hover:scale-105'
                      }`}
                      style={{ background: g.value }}
                    />
                  ))}
                </div>
              )}

              {settings.bgType === 'mesh' && (
                <div className="grid grid-cols-3 gap-2">
                  {MESH_GRADIENTS.map((g, i) => (
                    <button
                      key={i}
                      title={g.label}
                      onClick={() => {
                        setSelectedMeshIdx(i)
                        update('bgGradient', g.value)
                      }}
                      className={`h-10 rounded-lg text-xs transition-all ${
                        selectedMeshIdx === i
                          ? 'ring-2 ring-accent ring-offset-1 ring-offset-panel'
                          : 'hover:scale-105'
                      }`}
                      style={{ background: g.value }}
                    />
                  ))}
                </div>
              )}

              {settings.bgType === 'solid' && (
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={settings.bgSolid}
                    onChange={(e) => update('bgSolid', e.target.value)}
                    className="w-10 h-10 rounded-lg border border-border cursor-pointer bg-transparent"
                  />
                  <span className="text-text-secondary text-sm font-mono">{settings.bgSolid}</span>
                </div>
              )}
            </div>

            {/* Padding */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <SectionHeader title="Padding" />
                <button
                  onClick={() => setLockPadding(!lockPadding)}
                  className="text-text-dim hover:text-text-secondary transition-colors"
                  title={lockPadding ? 'Unlock axes' : 'Lock axes'}
                >
                  {lockPadding ? <Lock size={13} /> : <Unlock size={13} />}
                </button>
              </div>
              <div className="space-y-4">
                <SliderControl
                  label="Horizontal"
                  value={settings.paddingX}
                  min={0} max={120}
                  onChange={(v) => {
                    update('paddingX', v)
                    if (lockPadding) update('paddingY', v)
                  }}
                />
                {!lockPadding && (
                  <SliderControl
                    label="Vertical"
                    value={settings.paddingY}
                    min={0} max={120}
                    onChange={(v) => update('paddingY', v)}
                  />
                )}
              </div>
            </div>

            {/* Appearance */}
            <div>
              <SectionHeader title="Appearance" />
              <div className="space-y-4">
                <SliderControl
                  label="Corner Radius"
                  value={settings.borderRadius}
                  min={0} max={32}
                  onChange={(v) => update('borderRadius', v)}
                />
                <SliderControl
                  label="Shadow"
                  value={settings.shadowIntensity}
                  min={0} max={100}
                  unit="%"
                  onChange={(v) => update('shadowIntensity', v)}
                />
              </div>
            </div>

            {/* Browser Frame */}
            <div>
              <SectionHeader title="Frame" />
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-text-secondary text-sm">Browser chrome</span>
                <div
                  onClick={() => update('showBrowserFrame', !settings.showBrowserFrame)}
                  className={`relative w-9 h-5 rounded-full transition-colors ${
                    settings.showBrowserFrame ? 'bg-accent' : 'bg-border'
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                      settings.showBrowserFrame ? 'translate-x-4' : 'translate-x-0.5'
                    }`}
                  />
                </div>
              </label>
            </div>

            {/* Export Settings */}
            <div>
              <SectionHeader title="Export" />
              <div className="space-y-3">

                {/* Format */}
                <div className="flex items-center gap-2">
                  <span className="text-text-secondary text-xs flex-1">Format</span>
                  <div className="flex gap-1.5">
                    {(['png', 'jpeg'] as ExportFormat[]).map((f) => (
                      <button
                        key={f}
                        onClick={() => update('exportFormat', f)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium uppercase transition-all ${
                          settings.exportFormat === f
                            ? 'bg-accent text-white'
                            : 'bg-surface text-text-secondary border border-border hover:border-accent/30'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Resolution */}
                <div className="flex items-center gap-2">
                  <span className="text-text-secondary text-xs flex-1">Resolution</span>
                  <div className="flex gap-1.5">
                    {([1, 2, 3] as Scale[]).map((s) => {
                      const locked = !isPro && s > 1
                      return (
                        <button
                          key={s}
                          onClick={() => !locked && update('exportScale', s)}
                          title={locked ? 'Pro only' : undefined}
                          className={`relative px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            locked
                              ? 'opacity-40 cursor-not-allowed bg-surface text-text-dim border border-border'
                              : settings.exportScale === s
                              ? 'bg-accent text-white'
                              : 'bg-surface text-text-secondary border border-border hover:border-accent/30'
                          }`}
                        >
                          {s}×
                          {locked && (
                            <span className="absolute -top-1.5 -right-1.5 text-[8px] bg-gold text-void px-1 rounded-full font-bold">
                              PRO
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>

              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pb-4">
              <Button
                className="w-full"
                size="md"
                onClick={handleExport}
                loading={exporting}
                leftIcon={<Download size={15} />}
              >
                {isLoggedIn
                  ? `Export Image${!isPro ? ` (${remaining} left)` : ''}`
                  : 'Sign in to Export'}
              </Button>
              <Button
                className="w-full"
                variant="secondary"
                size="md"
                onClick={() => setSettings(defaultSettings)}
                leftIcon={<RefreshCw size={14} />}
              >
                Reset Defaults
              </Button>
              {!isPro && (
                <Link to="/pricing" className="block">
                  <Button
                    className="w-full"
                    variant="gold"
                    size="md"
                    leftIcon={<Crown size={14} />}
                  >
                    Upgrade to Pro
                  </Button>
                </Link>
              )}
            </div>

          </div>
        </aside>

        {/* Canvas Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 min-h-[600px] bg-void relative overflow-hidden">

          <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-30" />

          {!uploadedImage ? (
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
              className="relative z-10 w-full max-w-lg cursor-pointer group"
            >
              <div className="border-2 border-dashed border-border hover:border-accent/50 rounded-2xl p-16 text-center transition-all duration-300 bg-panel/50 hover:bg-accent/5 group-hover:shadow-glow-accent/10">
                <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-5 group-hover:bg-accent/20 transition-colors">
                  <ImageIcon size={24} className="text-accent" />
                </div>
                <p className="text-text-primary font-display font-medium mb-1">
                  Drop your screenshot here
                </p>
                <p className="text-text-dim text-sm mb-5">
                  or click to browse files
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent/10 border border-accent/20 text-accent text-sm font-medium">
                  <Upload size={14} />
                  Browse Image
                </div>
                <p className="mt-4 text-text-dim text-xs">PNG, JPG, GIF, WebP · Max 10MB</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>
          ) : (
            <div className="relative z-10 flex flex-col items-center gap-6 w-full">
              <div className="flex items-center gap-3">
                <Badge variant="success" dot>Live Preview</Badge>
                <button
                  onClick={() => setUploadedImage(null)}
                  className="text-text-dim hover:text-text-secondary text-xs flex items-center gap-1 transition-colors"
                >
                  <RefreshCw size={12} /> Change image
                </button>
              </div>

              {/* Canvas */}
              <div
                ref={canvasRef}
                className="max-w-3xl w-full"
                style={{
                  background,
                  padding: `${settings.paddingY}px ${settings.paddingX}px`,
                  borderRadius: `${settings.borderRadius * 2}px`,
                }}
              >
                {settings.showBrowserFrame ? (
                  <div
                    className="overflow-hidden"
                    style={{
                      borderRadius: `${settings.borderRadius}px`,
                      boxShadow: shadow,
                    }}
                  >
                    <div className="bg-[#1e1e2e] border-b border-[#2e2e3e] px-4 py-3 flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/80" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                      <div className="w-3 h-3 rounded-full bg-green-500/80" />
                      <div className="flex-1 mx-4 h-6 bg-[#13131a] rounded-md flex items-center justify-center">
                        <div className="w-24 h-2.5 bg-[#2e2e3e] rounded-sm" />
                      </div>
                    </div>
                    <img
                      src={uploadedImage}
                      alt="Screenshot"
                      className="w-full block"
                      crossOrigin="anonymous"
                    />
                  </div>
                ) : (
                  <img
                    src={uploadedImage}
                    alt="Screenshot"
                    className="w-full block"
                    style={{
                      borderRadius: `${settings.borderRadius}px`,
                      boxShadow: shadow,
                    }}
                    crossOrigin="anonymous"
                  />
                )}
              </div>

              {/* Export Button */}
              <Button
                size="md"
                onClick={handleExport}
                loading={exporting}
                leftIcon={<Download size={15} />}
              >
                {isLoggedIn
                  ? `Export as ${settings.exportFormat.toUpperCase()} · ${settings.exportScale}×${!isPro ? ` (${remaining} left)` : ''}`
                  : 'Sign in to Export'}
              </Button>

              {/* Save to account prompt */}
              {lastExportDataUrl && isLoggedIn && !savedToAccount && (
                <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-panel border border-accent/20 shadow-inner-top w-full max-w-md">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                    <Save size={14} className="text-accent" />
                  </div>
                  <div className="flex-1">
                    <p className="text-text-primary text-xs font-medium">Save to your account?</p>
                    <p className="text-text-dim text-xs">Access it from your dashboard for 30 days.</p>
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={handleSaveToAccount}
                    loading={saving}
                  >
                    Save
                  </Button>
                  <button
                    onClick={() => setLastExportDataUrl(null)}
                    className="text-text-dim hover:text-text-secondary text-xs transition-colors shrink-0"
                  >
                    Skip
                  </button>
                </div>
              )}

              {savedToAccount && (
                <p className="text-emerald-400 text-xs flex items-center gap-1.5">
                  ✓ Saved to your dashboard
                </p>
              )}

            </div>
          )}
        </div>

      </div>
    </div>
  )
}