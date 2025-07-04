"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RocketIcon, ChevronRight, ExternalLink } from "lucide-react";

interface WhatsNewSlide {
  title: string;
  description: string;
  linkText?: string;
  linkUrl?: string;
  linkMediaEmbed?: string;
  badge?: string;
}

const defaultSlides: WhatsNewSlide[] = [
  {
    title: "Support for Multiple Themes",
    description:
      "You can now switch between different themes to suit your preferences",
    linkMediaEmbed:
      "https://player.cloudinary.com/embed/?cloud_name=dx14grc8x&public_id=0704_qiyxk5&profile=dotheon&player[posterOptions][transformation][start_offset]=0",
    badge: "New",
  },
  {
    title: "Portfolio Management",
    description:
      "Track your portfolio performance with advanced analytics, real-time visualizations, and comprehensive reporting tools. This feature is developing and will be available soon.",
    badge: "Coming Soon",
  },
];

interface WhatsNewDialogProps {
  slides?: WhatsNewSlide[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  triggerButton?: boolean;
}

export function WhatsNewDialog({
  slides = defaultSlides,
  open,
  onOpenChange,
  triggerButton = false,
}: WhatsNewDialogProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(open || false);

  const handleOpenChange = (newOpen: boolean) => {
    setDialogOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      handleOpenChange(false);
    }
  };

  const handlePrevious = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const dialogContent = (
    <DialogContent className="sm:max-w-2xl min-h-[60vh] lg:min-h-[90vh] p-2 overflow-hidden bg-secondary text-secondary-foreground shadow-2xl flex flex-col">
      <DialogTitle className="sr-only">What's New</DialogTitle>
      {/* Body */}
      <div className="flex-1 flex flex-col gap-12">
        {/* Media embed */}
        {slides[currentSlide].linkMediaEmbed ? (
          <div className="mb-2 rounded-xl overflow-hidden shadow-xl bg-muted/50 border">
            <div className="aspect-video">
              <iframe
                src={`${slides[currentSlide].linkMediaEmbed}&autoplay=true&mute=true`}
                width="100%"
                height="100%"
                allowFullScreen
                title={slides[currentSlide].title}
              />
            </div>
          </div>
        ) : (
          <div className="mb-8" />
        )}

        {/* Content */}
        <div
          className={cn(
            "space-y-2 transition-all",
            !slides[currentSlide].linkMediaEmbed &&
              "flex-1 flex flex-col justify-center"
          )}
        >
          <h2 className="text-2xl font-bold text-center">
            {slides[currentSlide].title}
          </h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto leading-relaxed">
            {slides[currentSlide].description}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t bg-muted/30 backdrop-blur-sm p-6 mt-6">
        <div className="flex justify-center gap-3 mb-4">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={cn(
                "rounded-full transition-all duration-300 hover:scale-110",
                index === currentSlide
                  ? "bg-primary w-8 h-2 shadow-lg shadow-primary/25"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50 size-2"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <RocketIcon className="size-5 text-primary" />
            </div>
            <div>
              <span className="font-semibold text-foreground">
                Dotheon just Updated!
              </span>
              <p className="text-sm text-muted-foreground">
                {currentSlide + 1} of {slides.length} updates
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {currentSlide > 0 && (
              <Button
                variant="outline"
                onClick={handlePrevious}
                className="hover:bg-muted bg-transparent"
              >
                Previous
              </Button>
            )}
            <Button onClick={handleNext}>
              {currentSlide < slides.length - 1 ? <>Next</> : "Done"}
            </Button>
          </div>
        </div>
      </div>
    </DialogContent>
  );

  return (
    <Dialog open={dialogOpen || open} onOpenChange={handleOpenChange}>
      {triggerButton && (
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <RocketIcon className="size-4" />
            What's New
          </Button>
        </DialogTrigger>
      )}
      {dialogContent}
    </Dialog>
  );
}

export default WhatsNewDialog;
