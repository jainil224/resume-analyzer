import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X, SlidersHorizontal } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface CandidateFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  roleFilter: string;
  onRoleChange: (value: string) => void;
  scoreFilter: string;
  onScoreChange: (value: string) => void;
  experienceFilter: string;
  onExperienceChange: (value: string) => void;
  skillFilter: string;
  onSkillChange: (value: string) => void;
  uniqueRoles: string[];
  onClearFilters: () => void;
}

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "pending", label: "Pending" },
  { value: "reviewed", label: "Reviewed" },
  { value: "shortlisted", label: "Shortlisted" },
  { value: "rejected", label: "Rejected" },
  { value: "selected", label: "Selected" },
];

const experienceOptions = [
  { value: "all", label: "All Experience" },
  { value: "fresher", label: "Fresher (0-1 years)" },
  { value: "junior", label: "Junior (1-3 years)" },
  { value: "mid", label: "Mid-level (3-5 years)" },
  { value: "senior", label: "Senior (5+ years)" },
];

const scoreOptions = [
  { value: "all", label: "All Scores" },
  { value: "excellent", label: "Excellent (80%+)" },
  { value: "good", label: "Good (60-79%)" },
  { value: "average", label: "Average (40-59%)" },
  { value: "low", label: "Below Average (<40%)" },
];

const commonSkills = [
  "Python", "Java", "JavaScript", "React", "Node.js", "SQL", 
  "Data Analysis", "Machine Learning", "AWS", "Docker"
];

export function CandidateFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  roleFilter,
  onRoleChange,
  scoreFilter,
  onScoreChange,
  experienceFilter,
  onExperienceChange,
  skillFilter,
  onSkillChange,
  uniqueRoles,
  onClearFilters,
}: CandidateFiltersProps) {
  const activeFiltersCount = [
    statusFilter !== "all",
    roleFilter !== "all",
    scoreFilter !== "all",
    experienceFilter !== "all",
    skillFilter !== "all",
  ].filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Main Search & Quick Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or skill..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="w-full md:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={roleFilter} onValueChange={onRoleChange}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            {uniqueRoles.map(role => (
              <SelectItem key={role} value={role}>{role}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={scoreFilter} onValueChange={onScoreChange}>
          <SelectTrigger className="w-full md:w-44">
            <SelectValue placeholder="ATS Score" />
          </SelectTrigger>
          <SelectContent>
            {scoreOptions.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Advanced Filters Sheet */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="relative">
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              More Filters
              {activeFiltersCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs bg-accent">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Advanced Filters</SheetTitle>
            </SheetHeader>
            <div className="space-y-6 pt-6">
              <div className="space-y-3">
                <Label>Experience Level</Label>
                <Select value={experienceFilter} onValueChange={onExperienceChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {experienceOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>Filter by Skill</Label>
                <Select value={skillFilter} onValueChange={onSkillChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select skill" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Skills</SelectItem>
                    {commonSkills.map(skill => (
                      <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button variant="outline" onClick={onClearFilters} className="w-full">
                <X className="w-4 h-4 mr-2" />
                Clear All Filters
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {statusFilter !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Status: {statusOptions.find(s => s.value === statusFilter)?.label}
              <X className="w-3 h-3 cursor-pointer" onClick={() => onStatusChange("all")} />
            </Badge>
          )}
          {roleFilter !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Role: {roleFilter}
              <X className="w-3 h-3 cursor-pointer" onClick={() => onRoleChange("all")} />
            </Badge>
          )}
          {scoreFilter !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Score: {scoreOptions.find(s => s.value === scoreFilter)?.label}
              <X className="w-3 h-3 cursor-pointer" onClick={() => onScoreChange("all")} />
            </Badge>
          )}
          {experienceFilter !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Experience: {experienceOptions.find(e => e.value === experienceFilter)?.label}
              <X className="w-3 h-3 cursor-pointer" onClick={() => onExperienceChange("all")} />
            </Badge>
          )}
          {skillFilter !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Skill: {skillFilter}
              <X className="w-3 h-3 cursor-pointer" onClick={() => onSkillChange("all")} />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}