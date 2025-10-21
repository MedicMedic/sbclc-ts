import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ZapIcon,
  DatabaseIcon,
  ClockIcon,
  TrendingUpIcon,
  MemoryStickIcon,
  RefreshCwIcon,
  SettingsIcon,
} from "lucide-react";

interface PerformanceMetrics {
  renderTime: number;
  dataLoadTime: number;
  memoryUsage: number;
  cacheHitRate: number;
  totalRecords: number;
  visibleRecords: number;
}

interface CacheConfig {
  enabled: boolean;
  maxSize: number;
  ttl: number; // Time to live in minutes
}

interface VirtualizationConfig {
  enabled: boolean;
  itemHeight: number;
  overscan: number;
  bufferSize: number;
}

interface MonitoringPerformanceOptimizerProps {
  data?: any[];
  onDataLoad?: (config: any) => Promise<any[]>;
  onPerformanceUpdate?: (metrics: PerformanceMetrics) => void;
  className?: string;
}

export function MonitoringPerformanceOptimizer({
  data = [],
  onDataLoad,
  onPerformanceUpdate,
  className = "",
}: MonitoringPerformanceOptimizerProps) {
  const [performanceMetrics, setPerformanceMetrics] =
    useState<PerformanceMetrics>({
      renderTime: 0,
      dataLoadTime: 0,
      memoryUsage: 0,
      cacheHitRate: 0,
      totalRecords: 0,
      visibleRecords: 0,
    });

  const [cacheConfig, setCacheConfig] = useState<CacheConfig>({
    enabled: true,
    maxSize: 1000,
    ttl: 30,
  });

  const [virtualizationConfig, setVirtualizationConfig] =
    useState<VirtualizationConfig>({
      enabled: true,
      itemHeight: 60,
      overscan: 5,
      bufferSize: 50,
    });

  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  const [dataCache] = useState(new Map());
  const [lastOptimization, setLastOptimization] = useState<Date | null>(null);

  // Performance monitoring
  useEffect(() => {
    const startTime = performance.now();

    // Simulate render time measurement
    const measureRenderTime = () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;

      setPerformanceMetrics((prev) => ({
        ...prev,
        renderTime,
        totalRecords: data.length,
        visibleRecords: virtualizationConfig.enabled
          ? Math.min(virtualizationConfig.bufferSize, data.length)
          : data.length,
      }));
    };

    // Use requestAnimationFrame to measure after render
    requestAnimationFrame(measureRenderTime);
  }, [data, virtualizationConfig]);

  // Memory usage estimation
  const estimateMemoryUsage = useCallback(() => {
    const dataSize = JSON.stringify(data).length;
    const cacheSize = Array.from(dataCache.values()).reduce((total, item) => {
      return total + JSON.stringify(item).length;
    }, 0);

    return (dataSize + cacheSize) / 1024; // Convert to KB
  }, [data, dataCache]);

  // Cache hit rate calculation
  const calculateCacheHitRate = useCallback(() => {
    // Mock cache hit rate calculation
    return cacheConfig.enabled ? Math.random() * 0.4 + 0.6 : 0; // 60-100% when enabled
  }, [cacheConfig.enabled]);

  // Optimized data processing with memoization
  const processedData = useMemo(() => {
    const startTime = performance.now();

    // Apply virtualization if enabled
    let result = data;
    if (
      virtualizationConfig.enabled &&
      data.length > virtualizationConfig.bufferSize
    ) {
      result = data.slice(0, virtualizationConfig.bufferSize);
    }

    // Update performance metrics
    const processingTime = performance.now() - startTime;
    setPerformanceMetrics((prev) => ({
      ...prev,
      dataLoadTime: processingTime,
      memoryUsage: estimateMemoryUsage(),
      cacheHitRate: calculateCacheHitRate(),
    }));

    return result;
  }, [data, virtualizationConfig, estimateMemoryUsage, calculateCacheHitRate]);

  // Auto-optimization
  const runOptimization = async () => {
    setIsOptimizing(true);
    setOptimizationProgress(0);

    // Simulate optimization steps
    const steps = [
      { name: "Analyzing data patterns", duration: 500 },
      { name: "Optimizing cache configuration", duration: 300 },
      { name: "Adjusting virtualization settings", duration: 400 },
      { name: "Cleaning up memory", duration: 200 },
      { name: "Finalizing optimizations", duration: 100 },
    ];

    let progress = 0;
    for (const step of steps) {
      await new Promise((resolve) => setTimeout(resolve, step.duration));
      progress += 100 / steps.length;
      setOptimizationProgress(progress);
    }

    // Apply optimizations based on data size
    if (data.length > 1000) {
      setVirtualizationConfig((prev) => ({
        ...prev,
        enabled: true,
        bufferSize: Math.min(100, Math.max(50, Math.floor(data.length * 0.1))),
      }));
    }

    if (data.length > 500) {
      setCacheConfig((prev) => ({
        ...prev,
        enabled: true,
        maxSize: Math.min(1000, Math.max(100, Math.floor(data.length * 0.2))),
      }));
    }

    setLastOptimization(new Date());
    setIsOptimizing(false);
    setOptimizationProgress(0);
  };

  // Performance recommendations
  const getPerformanceRecommendations = () => {
    const recommendations = [];

    if (performanceMetrics.renderTime > 100) {
      recommendations.push({
        type: "warning",
        message: "Render time is high. Consider enabling virtualization.",
        action: () =>
          setVirtualizationConfig((prev) => ({ ...prev, enabled: true })),
      });
    }

    if (performanceMetrics.memoryUsage > 1024) {
      // > 1MB
      recommendations.push({
        type: "error",
        message:
          "High memory usage detected. Enable caching and reduce buffer size.",
        action: () => {
          setCacheConfig((prev) => ({ ...prev, enabled: true }));
          setVirtualizationConfig((prev) => ({ ...prev, bufferSize: 50 }));
        },
      });
    }

    if (performanceMetrics.cacheHitRate < 0.5 && cacheConfig.enabled) {
      recommendations.push({
        type: "info",
        message: "Low cache hit rate. Consider increasing cache size.",
        action: () =>
          setCacheConfig((prev) => ({ ...prev, maxSize: prev.maxSize * 1.5 })),
      });
    }

    if (data.length > 500 && !virtualizationConfig.enabled) {
      recommendations.push({
        type: "warning",
        message:
          "Large dataset detected. Enable virtualization for better performance.",
        action: () =>
          setVirtualizationConfig((prev) => ({ ...prev, enabled: true })),
      });
    }

    return recommendations;
  };

  const recommendations = getPerformanceRecommendations();

  const getPerformanceScore = () => {
    let score = 100;

    if (performanceMetrics.renderTime > 50) score -= 20;
    if (performanceMetrics.renderTime > 100) score -= 20;
    if (performanceMetrics.memoryUsage > 512) score -= 15;
    if (performanceMetrics.memoryUsage > 1024) score -= 15;
    if (performanceMetrics.cacheHitRate < 0.7 && cacheConfig.enabled)
      score -= 10;
    if (data.length > 500 && !virtualizationConfig.enabled) score -= 20;

    return Math.max(0, score);
  };

  const performanceScore = getPerformanceScore();
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Performance Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ZapIcon className="h-5 w-5" />

              <span>Performance Monitor</span>
            </div>
            <div className="flex items-center space-x-2">
              <span
                className={`text-2xl font-bold ${getScoreColor(performanceScore)}`}
              >
                {performanceScore}
              </span>
              <span className="text-sm text-gray-600">/ 100</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <ClockIcon className="h-4 w-4 text-blue-600" />

                <Label className="text-sm">Render Time</Label>
              </div>
              <div className="text-2xl font-bold">
                {performanceMetrics.renderTime.toFixed(1)}ms
              </div>
              <Progress
                value={Math.min(
                  100,
                  (performanceMetrics.renderTime / 200) * 100
                )}
                className="h-2"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <MemoryStickIcon className="h-4 w-4 text-purple-600" />

                <Label className="text-sm">Memory Usage</Label>
              </div>
              <div className="text-2xl font-bold">
                {performanceMetrics.memoryUsage.toFixed(1)}KB
              </div>
              <Progress
                value={Math.min(
                  100,
                  (performanceMetrics.memoryUsage / 2048) * 100
                )}
                className="h-2"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <DatabaseIcon className="h-4 w-4 text-green-600" />

                <Label className="text-sm">Cache Hit Rate</Label>
              </div>
              <div className="text-2xl font-bold">
                {(performanceMetrics.cacheHitRate * 100).toFixed(1)}%
              </div>
              <Progress
                value={performanceMetrics.cacheHitRate * 100}
                className="h-2"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <TrendingUpIcon className="h-4 w-4 text-orange-600" />

                <Label className="text-sm">Records</Label>
              </div>
              <div className="text-2xl font-bold">
                {performanceMetrics.visibleRecords}/
                {performanceMetrics.totalRecords}
              </div>
              <Progress
                value={
                  (performanceMetrics.visibleRecords /
                    Math.max(1, performanceMetrics.totalRecords)) *
                  100
                }
                className="h-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Optimization Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cache Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DatabaseIcon className="h-5 w-5" />

              <span>Cache Configuration</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Enable Caching</Label>
              <Switch
                checked={cacheConfig.enabled}
                onCheckedChange={(enabled) =>
                  setCacheConfig((prev) => ({ ...prev, enabled }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Cache Size</Label>
              <Select
                value={cacheConfig.maxSize.toString()}
                onValueChange={(value) =>
                  setCacheConfig((prev) => ({
                    ...prev,
                    maxSize: parseInt(value),
                  }))
                }
                disabled={!cacheConfig.enabled}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="100">100 items</SelectItem>
                  <SelectItem value="500">500 items</SelectItem>
                  <SelectItem value="1000">1000 items</SelectItem>
                  <SelectItem value="2000">2000 items</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Cache TTL</Label>
              <Select
                value={cacheConfig.ttl.toString()}
                onValueChange={(value) =>
                  setCacheConfig((prev) => ({ ...prev, ttl: parseInt(value) }))
                }
                disabled={!cacheConfig.enabled}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 minutes</SelectItem>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Virtualization Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MemoryStickIcon className="h-5 w-5" />

              <span>Virtualization</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Enable Virtualization</Label>
              <Switch
                checked={virtualizationConfig.enabled}
                onCheckedChange={(enabled) =>
                  setVirtualizationConfig((prev) => ({ ...prev, enabled }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Buffer Size</Label>
              <Select
                value={virtualizationConfig.bufferSize.toString()}
                onValueChange={(value) =>
                  setVirtualizationConfig((prev) => ({
                    ...prev,
                    bufferSize: parseInt(value),
                  }))
                }
                disabled={!virtualizationConfig.enabled}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="25">25 items</SelectItem>
                  <SelectItem value="50">50 items</SelectItem>
                  <SelectItem value="100">100 items</SelectItem>
                  <SelectItem value="200">200 items</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Item Height</Label>
              <Select
                value={virtualizationConfig.itemHeight.toString()}
                onValueChange={(value) =>
                  setVirtualizationConfig((prev) => ({
                    ...prev,
                    itemHeight: parseInt(value),
                  }))
                }
                disabled={!virtualizationConfig.enabled}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="40">40px</SelectItem>
                  <SelectItem value="60">60px</SelectItem>
                  <SelectItem value="80">80px</SelectItem>
                  <SelectItem value="100">100px</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Auto-Optimization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <SettingsIcon className="h-5 w-5" />

              <span>Auto-Optimization</span>
            </div>
            {lastOptimization && (
              <Badge variant="outline">
                Last run: {lastOptimization.toLocaleTimeString()}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isOptimizing ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Optimizing performance...</span>
                <span>{Math.round(optimizationProgress)}%</span>
              </div>
              <Progress value={optimizationProgress} />
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-600">
                Automatically optimize cache and virtualization settings based
                on your data patterns.
              </p>
              <Button onClick={runOptimization} className="w-full">
                <ZapIcon className="h-4 w-4 mr-2" />
                Run Auto-Optimization
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Recommendations */}
      {recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUpIcon className="h-5 w-5" />

              <span>Performance Recommendations</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recommendations.map((rec, index) => (
                <div
                  key={index}
                  className="flex items-start justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <Badge
                      variant={
                        rec.type === "error"
                          ? "destructive"
                          : rec.type === "warning"
                            ? "secondary"
                            : "outline"
                      }
                      className="mb-2"
                    >
                      {rec.type.toUpperCase()}
                    </Badge>
                    <p className="text-sm">{rec.message}</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={rec.action}>
                    Apply Fix
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
