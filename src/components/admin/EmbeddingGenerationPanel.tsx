import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Cpu, Database, Zap, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react'
import { supabase } from '@/lib/supabase-client'
import { toast } from '@/hooks/use-toast'

interface EmbeddingStats {
  manual_title: string
  total_chunks: number
  chunks_with_embeddings: number
  embedding_coverage: number
  avg_extraction_quality: number
  pages_with_visuals: number
  unique_sections: number
}

export function EmbeddingGenerationPanel() {
  const [stats, setStats] = useState<EmbeddingStats[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [lastGeneration, setLastGeneration] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Fetch current embedding statistics
  const fetchStats = async () => {
    try {
      const { data, error } = await supabase.rpc('get_manual_coverage_stats')

      if (error) {
        console.error('Error fetching stats:', error)
        return
      }

      setStats(data || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch latest generation log
  const fetchLatestGeneration = async () => {
    try {
      const { data, error } = await supabase
        .from('embedding_generation_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (error && error.code !== 'PGRST116') { // Not "not found" error
        console.error('Error fetching latest generation:', error)
        return
      }

      setLastGeneration(data)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  useEffect(() => {
    fetchStats()
    fetchLatestGeneration()
  }, [])

  // Start embedding generation
  const startGeneration = async (batchSize: number = 100, resume: boolean = true) => {
    if (isGenerating) return

    setIsGenerating(true)
    setProgress(0)

    try {
      toast({
        title: "🚀 Starting Embedding Generation",
        description: `Processing ${resume ? 'missing' : 'all'} embeddings in batches of ${batchSize}`,
      })

      const { data, error } = await supabase.functions.invoke('generate-embeddings', {
        body: { batchSize, resume }
      })

      if (error) {
        throw new Error(`Generation failed: ${error.message}`)
      }

      const result = data

      if (result.success) {
        toast({
          title: "✅ Embedding Generation Complete",
          description: `Processed ${result.processed} chunks with ${result.successRate} success rate`,
        })

        // Refresh stats and latest generation
        await fetchStats()
        await fetchLatestGeneration()
      } else {
        throw new Error(result.error || 'Generation failed')
      }
    } catch (error) {
      console.error('Generation error:', error)
      toast({
        title: "❌ Generation Failed",
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: "destructive"
      })
    } finally {
      setIsGenerating(false)
      setProgress(0)
    }
  }

  const totalChunks = stats.reduce((sum, stat) => sum + stat.total_chunks, 0)
  const totalWithEmbeddings = stats.reduce((sum, stat) => sum + stat.chunks_with_embeddings, 0)
  const overallCoverage = totalChunks > 0 ? (totalWithEmbeddings / totalChunks * 100) : 0

  const getCoverageColor = (coverage: number) => {
    if (coverage >= 95) return 'bg-green-500'
    if (coverage >= 80) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getCoverageBadge = (coverage: number) => {
    if (coverage >= 95) return <Badge variant="default" className="bg-green-600">Excellent</Badge>
    if (coverage >= 80) return <Badge variant="secondary" className="bg-yellow-600">Good</Badge>
    return <Badge variant="destructive">Needs Work</Badge>
  }

  return (
    <div className="space-y-6">
      {/* Overall Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{totalChunks.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Manual Chunks</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Cpu className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{totalWithEmbeddings.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">With Embeddings</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{overallCoverage.toFixed(1)}%</p>
                <p className="text-sm text-muted-foreground">Coverage</p>
                {getCoverageBadge(overallCoverage)}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Generation Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Embedding Generation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {lastGeneration && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Last generation: {new Date(lastGeneration.created_at).toLocaleString()} -
                Processed {lastGeneration.chunks_processed} chunks
                ({(lastGeneration.chunks_processed / lastGeneration.total_chunks_attempted * 100).toFixed(1)}% success rate)
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-4">
            <Button
              onClick={() => startGeneration(50, true)}
              disabled={isGenerating || loading}
              className="flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Cpu className="h-4 w-4" />
                  Resume Generation
                </>
              )}
            </Button>

            <Button
              onClick={() => startGeneration(25, false)}
              disabled={isGenerating || loading}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Database className="h-4 w-4" />
              Regenerate All
            </Button>

            <Button
              onClick={() => {fetchStats(); fetchLatestGeneration()}}
              disabled={loading}
              variant="ghost"
              size="sm"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>

          {isGenerating && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Generating embeddings...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Per-Manual Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Manual Coverage Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <div className="space-y-4">
              {stats.map((stat, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium truncate">{stat.manual_title}</h3>
                    {getCoverageBadge(stat.embedding_coverage)}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="font-medium">{stat.total_chunks}</p>
                      <p className="text-muted-foreground">Total Chunks</p>
                    </div>
                    <div>
                      <p className="font-medium">{stat.chunks_with_embeddings}</p>
                      <p className="text-muted-foreground">With Embeddings</p>
                    </div>
                    <div>
                      <p className="font-medium">{stat.pages_with_visuals}</p>
                      <p className="text-muted-foreground">Visual Pages</p>
                    </div>
                    <div>
                      <p className="font-medium">{stat.unique_sections}</p>
                      <p className="text-muted-foreground">Sections</p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Embedding Coverage</span>
                      <span>{stat.embedding_coverage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getCoverageColor(stat.embedding_coverage)}`}
                        style={{ width: `${stat.embedding_coverage}%` }}
                      />
                    </div>
                  </div>

                  {stat.avg_extraction_quality && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      Quality Score: {stat.avg_extraction_quality.toFixed(2)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default EmbeddingGenerationPanel