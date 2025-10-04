import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/lib/supabase-client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface CompatibilityReportFormProps {
  trackId: string;
  trackName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface UnimogModel {
  model: string;
  typical_wheelbase_cm: number;
  typical_height_cm: number;
  typical_width_cm: number;
}

export function CompatibilityReportForm({
  trackId,
  trackName,
  isOpen,
  onClose,
  onSuccess,
}: CompatibilityReportFormProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [unimogModels, setUnimogModels] = useState<UnimogModel[]>([]);

  // Form state
  const [selectedModel, setSelectedModel] = useState('');
  const [totalHeight, setTotalHeight] = useState('');
  const [totalWidth, setTotalWidth] = useState('');
  const [groundClearance, setGroundClearance] = useState('');
  const [bodyType, setBodyType] = useState('');
  const [camperManufacturer, setCamperManufacturer] = useState('');
  const [successfullyCompleted, setSuccessfullyCompleted] = useState<boolean | null>(null);
  const [drivenDate, setDrivenDate] = useState(new Date().toISOString().split('T')[0]);
  const [weatherConditions, setWeatherConditions] = useState('dry');

  // Width issues
  const [widthTight, setWidthTight] = useState<string>('no');
  const [narrowestWidth, setNarrowestWidth] = useState('');
  const [widthLocation, setWidthLocation] = useState('');
  const [scrapedSides, setScrapedSides] = useState(false);

  // Height issues
  const [heightTight, setHeightTight] = useState<string>('no');
  const [lowestOverhead, setLowestOverhead] = useState('');
  const [heightLocation, setHeightLocation] = useState('');
  const [hitOverhead, setHitOverhead] = useState(false);
  const [overheadDamage, setOverheadDamage] = useState('');

  // Wheelbase issues
  const [wheelbaseIssue, setWheelbaseIssue] = useState(false);
  const [requiredReversing, setRequiredReversing] = useState<string>('no');
  const [turningLocation, setTurningLocation] = useState('');

  // Ground clearance issues
  const [groundContact, setGroundContact] = useState(false);
  const [clearanceLocation, setClearanceLocation] = useState('');

  // General
  const [recommendedType, setRecommendedType] = useState('any_unimog');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchUnimogModels();
    }
  }, [isOpen]);

  const fetchUnimogModels = async () => {
    try {
      const { data, error } = await supabase
        .from('unimog_models')
        .select('*')
        .eq('is_common', true)
        .order('model');

      if (error) throw error;
      setUnimogModels(data || []);
    } catch (error) {
      console.error('Error fetching Unimog models:', error);
    }
  };

  const handleModelChange = (modelName: string) => {
    setSelectedModel(modelName);
    const model = unimogModels.find((m) => m.model === modelName);
    if (model) {
      setTotalHeight(model.typical_height_cm.toString());
      setTotalWidth(model.typical_width_cm.toString());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please sign in to submit a report');
      return;
    }

    setIsSubmitting(true);

    try {
      // Get typical wheelbase from selected model
      const model = unimogModels.find((m) => m.model === selectedModel);
      const wheelbase = model?.typical_wheelbase_cm || 0;

      const { error } = await supabase
        .from('unimog_compatibility_reports')
        .insert({
          track_id: trackId,
          user_id: user.id,
          unimog_model: selectedModel || 'Unknown',
          wheelbase_cm: wheelbase,
          total_height_cm: totalHeight ? parseInt(totalHeight) : 0,
          total_width_cm: totalWidth ? parseInt(totalWidth) : null,
          ground_clearance_cm: groundClearance ? parseInt(groundClearance) : null,
          body_type: bodyType || null,
          camper_manufacturer: camperManufacturer || null,
          successfully_completed: successfullyCompleted !== null ? successfullyCompleted : true,
          narrowest_section_width_m: narrowestWidth ? parseFloat(narrowestWidth) : null,
          width_tight: widthTight === 'yes',
          width_issue_location: widthLocation || null,
          scraped_sides: scrapedSides,
          lowest_overhead_m: lowestOverhead ? parseFloat(lowestOverhead) : null,
          height_tight: heightTight === 'yes',
          height_issue_location: heightLocation || null,
          hit_overhead: hitOverhead,
          overhead_damage: overheadDamage || null,
          wheelbase_issue: wheelbaseIssue,
          required_reversing: requiredReversing === 'yes',
          turning_issue_location: turningLocation || null,
          ground_contact: groundContact,
          clearance_issue_location: clearanceLocation || null,
          recommended_vehicle_type: recommendedType,
          notes: notes || null,
          driven_date: drivenDate,
          weather_conditions: weatherConditions,
        });

      if (error) throw error;

      toast.success('Thank you for sharing your experience!');
      onSuccess();
    } catch (error) {
      console.error('Error submitting report:', error);
      toast.error('Failed to submit report');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Share Your Experience: {trackName}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Vehicle Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Your Vehicle</h3>

            <div>
              <Label htmlFor="model">Unimog Model</Label>
              <Select value={selectedModel} onValueChange={handleModelChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  {unimogModels.map((model) => (
                    <SelectItem key={model.model} value={model.model}>
                      {model.model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="height">Total Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={totalHeight}
                  onChange={(e) => setTotalHeight(e.target.value)}
                  placeholder="Include camper"
                />
              </div>

              <div>
                <Label htmlFor="width">Total Width (cm)</Label>
                <Input
                  id="width"
                  type="number"
                  value={totalWidth}
                  onChange={(e) => setTotalWidth(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="clearance">Ground Clearance (cm)</Label>
                <Input
                  id="clearance"
                  type="number"
                  value={groundClearance}
                  onChange={(e) => setGroundClearance(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bodyType">Body/Camper Type</Label>
                <Select value={bodyType} onValueChange={setBodyType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flatbed">Flatbed</SelectItem>
                    <SelectItem value="box_camper">Box Camper</SelectItem>
                    <SelectItem value="popup_camper">Pop-up Camper</SelectItem>
                    <SelectItem value="roof_tent">Roof Tent</SelectItem>
                    <SelectItem value="expedition">Expedition Camper</SelectItem>
                    <SelectItem value="service_body">Service Body</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {bodyType && bodyType.includes('camper') && (
                <div>
                  <Label htmlFor="manufacturer">Camper Manufacturer</Label>
                  <Input
                    id="manufacturer"
                    value={camperManufacturer}
                    onChange={(e) => setCamperManufacturer(e.target.value)}
                    placeholder="e.g., Bliss Mobil"
                  />
                </div>
              )}
            </div>
          </div>

          {/* When & Conditions */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">When & Conditions</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date Driven</Label>
                <Input
                  id="date"
                  type="date"
                  value={drivenDate}
                  onChange={(e) => setDrivenDate(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="weather">Weather Conditions</Label>
                <Select value={weatherConditions} onValueChange={setWeatherConditions}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dry">Dry</SelectItem>
                    <SelectItem value="wet">Wet</SelectItem>
                    <SelectItem value="muddy">Muddy</SelectItem>
                    <SelectItem value="snow">Snow/Ice</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Completion Status */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Did you complete the track?</h3>
            <div className="flex gap-4">
              <Button
                type="button"
                variant={successfullyCompleted === true ? 'default' : 'outline'}
                onClick={() => setSuccessfullyCompleted(true)}
              >
                Yes, completed
              </Button>
              <Button
                type="button"
                variant={successfullyCompleted === false ? 'destructive' : 'outline'}
                onClick={() => setSuccessfullyCompleted(false)}
              >
                No, turned back
              </Button>
            </div>
          </div>

          {/* Width Issues */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-semibold">Width Concerns</h3>

            <div>
              <Label>Was width tight anywhere?</Label>
              <Select value={widthTight} onValueChange={setWidthTight}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no">No issues</SelectItem>
                  <SelectItem value="yes">Yes, tight</SelectItem>
                  <SelectItem value="too_narrow">Too narrow</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {widthTight !== 'no' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="narrowest">Narrowest section (meters)</Label>
                    <Input
                      id="narrowest"
                      type="number"
                      step="0.1"
                      value={narrowestWidth}
                      onChange={(e) => setNarrowestWidth(e.target.value)}
                      placeholder="e.g., 2.2"
                    />
                  </div>

                  <div className="flex items-end">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={scrapedSides}
                        onChange={(e) => setScrapedSides(e.target.checked)}
                        className="h-4 w-4"
                      />
                      <span className="text-sm">Scraped sides</span>
                    </label>
                  </div>
                </div>

                <div>
                  <Label htmlFor="widthLocation">Where was it tight?</Label>
                  <Input
                    id="widthLocation"
                    value={widthLocation}
                    onChange={(e) => setWidthLocation(e.target.value)}
                    placeholder="e.g., Between boulders at km 8.3"
                  />
                </div>
              </>
            )}
          </div>

          {/* Height Issues */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-semibold">Height Concerns</h3>

            <div>
              <Label>Was overhead clearance tight?</Label>
              <Select value={heightTight} onValueChange={setHeightTight}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no">No issues</SelectItem>
                  <SelectItem value="yes">Yes, tight</SelectItem>
                  <SelectItem value="hit">Hit obstacles</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {heightTight !== 'no' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="overhead">Lowest clearance (meters)</Label>
                    <Input
                      id="overhead"
                      type="number"
                      step="0.1"
                      value={lowestOverhead}
                      onChange={(e) => setLowestOverhead(e.target.value)}
                      placeholder="e.g., 3.2"
                    />
                  </div>

                  <div className="flex items-end">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={hitOverhead}
                        onChange={(e) => setHitOverhead(e.target.checked)}
                        className="h-4 w-4"
                      />
                      <span className="text-sm">Hit overhead obstacles</span>
                    </label>
                  </div>
                </div>

                <div>
                  <Label htmlFor="heightLocation">Where was it low?</Label>
                  <Input
                    id="heightLocation"
                    value={heightLocation}
                    onChange={(e) => setHeightLocation(e.target.value)}
                    placeholder="e.g., Low branches km 12-15"
                  />
                </div>

                {hitOverhead && (
                  <div>
                    <Label htmlFor="damage">Damage description (if any)</Label>
                    <Textarea
                      id="damage"
                      value={overheadDamage}
                      onChange={(e) => setOverheadDamage(e.target.value)}
                      rows={2}
                    />
                  </div>
                )}
              </>
            )}
          </div>

          {/* Turning Issues */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-semibold">Turning Radius</h3>

            <div>
              <Label>Required reversing/3-point turns?</Label>
              <Select value={requiredReversing} onValueChange={setRequiredReversing}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no">No</SelectItem>
                  <SelectItem value="yes">Yes (1-2 times)</SelectItem>
                  <SelectItem value="many">Yes (many times)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {requiredReversing !== 'no' && (
              <div>
                <Label htmlFor="turningLocation">Where?</Label>
                <Input
                  id="turningLocation"
                  value={turningLocation}
                  onChange={(e) => setTurningLocation(e.target.value)}
                  placeholder="e.g., Tight switchback at km 8.3"
                />
              </div>
            )}
          </div>

          {/* Recommendation */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-semibold">Recommendation</h3>

            <div>
              <Label htmlFor="recommended">Who is this track suitable for?</Label>
              <Select value={recommendedType} onValueChange={setRecommendedType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any_unimog">Any Unimog</SelectItem>
                  <SelectItem value="short_wb_only">Short wheelbase only</SelectItem>
                  <SelectItem value="low_rigs_only">Low rigs only (no tall campers)</SelectItem>
                  <SelectItem value="narrow_only">Narrow vehicles only</SelectItem>
                  <SelectItem value="experienced_only">Experienced drivers only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="notes">Additional notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder="Share any additional tips, hazards, or observations that would help other Unimog owners..."
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3 border-t pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Report'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
