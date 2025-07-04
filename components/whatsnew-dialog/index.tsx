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
import Image from "next/image";
import { Badge } from "../ui/badge";

interface WhatsNewSlide {
  title: string;
  description: string;
  linkText?: string;
  linkUrl?: string;
  linkImageEmbed?: string;
  linkVideoEmbed?: string;
  badge?: string;
}

const defaultSlides: WhatsNewSlide[] = [
  {
    title: "Support for Multiple Themes",
    description:
      "You can now switch between different themes to suit your preferences",
    linkVideoEmbed:
      "https://player.cloudinary.com/embed/?cloud_name=dx14grc8x&public_id=0704_qiyxk5&profile=dotheon&player[posterOptions][transformation][start_offset]=0",
    badge: "New",
  },
  {
    title: "Mint LST Token ( vDot , vETH )",
    description:
      "You can now mint LST token ( vDot , vETH ) to earn rewards from the protocol. Available on Testnet",
    linkImageEmbed:
      "https://res.cloudinary.com/dx14grc8x/image/upload/v1751621543/Screenshot_2025-07-04_at_16.31.10_aflkzh.png",
    badge: "New",
  },
  {
    title: "Redeem LST Token ( vDot , vETH )",
    description:
      "You can now redeem LST token ( vDot , vETH ) to get back your original assets. Available on Testnet",
    linkImageEmbed:
      "https://res.cloudinary.com/dx14grc8x/image/upload/v1751621544/Screenshot_2025-07-04_at_16.31.37_qcwaas.png",
    badge: "New",
  },
  {
    title: "Portfolio Management",
    description:
      "Track your portfolio performance with real-time visualizations, and comprehensive reporting tools. This feature is developing and will be available soon.",
    linkImageEmbed:
      "https://res.cloudinary.com/dx14grc8x/image/upload/v1751621545/Screenshot_2025-07-04_at_16.31.51_yjpfmp.png",
    badge: "Next Update",
  },
  {
    title: "AI DeFi Assistant",
    description:
      "You can now use AI to help you make decisions about your portfolio. This feature is developing and will be available soon.",
    linkImageEmbed:
      "https://res.cloudinary.com/dx14grc8x/image/upload/v1751621543/Screenshot_2025-07-04_at_16.31.59_oe6ohd.png",
    badge: "Next Update",
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
        {slides[currentSlide].linkVideoEmbed ? (
          <div className="mb-2 rounded-xl overflow-hidden shadow-xl bg-muted/50 border">
            <div className="aspect-video">
              <iframe
                src={`${slides[currentSlide].linkVideoEmbed}&autoplay=true&mute=true`}
                width="100%"
                height="100%"
                allowFullScreen
                title={slides[currentSlide].title}
              />
            </div>
          </div>
        ) : null}
        {slides[currentSlide].linkImageEmbed ? (
          <div className="mb-2 rounded-xl overflow-hidden shadow-xl bg-muted/50 border">
            <Image
              className="w-full h-full object-cover aspect-video"
              src={slides[currentSlide].linkImageEmbed}
              alt={slides[currentSlide].title}
              width={1000}
              height={1000}
            />
          </div>
        ) : null}

        {/* Content */}
        <div
          className={cn(
            "space-y-2 transition-all",
            !slides[currentSlide].linkImageEmbed &&
              !slides[currentSlide].linkVideoEmbed &&
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
        {/* Progress bar */}
        <div className="flex justify-center gap-3 mb-4">
          <Badge variant="outline" className="bg-primary/10 text-primary">
            {slides[currentSlide].badge}
          </Badge>
        </div>
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

        <div className="flex flex-col gap-4 items-start lg:flex-row justify-between lg:items-center">
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

          <div className="flex items-center justify-between gap-3 w-full lg:w-auto">
            {currentSlide > 0 && (
              <Button
                variant="outline"
                onClick={handlePrevious}
                className="hover:bg-muted bg-transparent"
              >
                Previous
              </Button>
            )}
            <Button
              onClick={handleNext}
              className={cn(currentSlide < slides.length - 1 ? "ml-auto" : "")}
            >
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
