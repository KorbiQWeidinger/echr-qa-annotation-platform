import { useAnnotation } from "@/contexts/annotation";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import { GoldenAnswerDisplay } from "./golden-answer-display";
import { GeneratedAnswerDisplay } from "./generated-answer-display";

export const AnswerDisplay = () => {
  const { annotation } = useAnnotation();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  useEffect(() => {
    if (!annotation) {
      return;
    }

    if (api) {
      setCurrent(1);
      api.scrollTo(0);
    }
  }, [annotation, api]);

  if (!annotation) {
    return null;
  }

  const numberToLetter = {
    2: "A",
    3: "B",
    4: "C",
    5: "D",
  };

  return (
    <div>
      <div className="text-center font-bold text-2xl pt-2">
        {current === 1
          ? "Target Answer"
          : `Experiment ${numberToLetter[current as 2 | 3 | 4 | 5]}`}
      </div>
      <Carousel setApi={setApi}>
        <CarouselContent>
          <CarouselItem>
            <div className="p-1">
              <GoldenAnswerDisplay evaluation={annotation} />
            </div>
          </CarouselItem>
          {annotation.generations.map((generation) => (
            <CarouselItem>
              <div className="p-1">
                <GeneratedAnswerDisplay generation={generation} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <div className="text-center text-lg font-bold pb-2">
        {current}/{count}
      </div>
    </div>
  );
};
