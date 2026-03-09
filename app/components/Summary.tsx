import ScoreGauge from '~/components/ScoreGauge';
import React from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionContent,
} from '~/components/Accordion';

const Summary = ({ feedback }: { feedback: any }) => {
  // Helper function for gradient background based on ATS score
  const getATSColor = (score: number) => {
    if (score > 7) return 'from-green-100';
    if (score > 5) return 'from-yellow-100';
    return 'from-red-100';
  };

  return (
    <div className="bg-white rounded-2xl shadow-md w-full p-6 flex flex-col gap-6">
      {/* Resume Score */}
      <div className="flex items-center gap-6">
        <ScoreGauge
          score={isNaN(feedback.overallScore) ? 0 : feedback.overallScore * 10}
        />
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold">Resume Score</h2>
          <p className="text-gray-500 text-sm">Your resume rating out of 10</p>
        </div>
      </div>

      {/* ATS Section */}
      {feedback.atsTips && (
        <div
          className={`rounded-2xl shadow-md w-full bg-gradient-to-b to-light-white p-4 flex flex-col gap-3 ${getATSColor(
            feedback.atsScore,
          )}`}
        >
          <div className="flex items-center gap-4">
            <img
              src={
                feedback.atsScore > 7
                  ? '/icons/ats-good.svg'
                  : feedback.atsScore > 5
                    ? '/icons/ats-warning.svg'
                    : '/icons/ats-bad.svg'
              }
              alt="ATS"
              className="w-10 h-10"
            />
            <p className="text-2xl font-semibold">
              ATS Score - {feedback.atsScore}/10
            </p>
          </div>

          <p className="font-medium text-lg">
            How well does your resume pass through Applicant Tracking Systems?
          </p>
          <p className="text-gray-500 text-sm">
            Your resume was scanned like an employer would. Here's how it
            performed:
          </p>

          <ul className="list-disc ml-6 space-y-1 text-gray-700">
            {feedback.atsTips.map((tip: string, idx: number) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>

          <p className="text-gray-500 text-sm mt-2">
            Want a better score? Improve your resume by applying the suggestions
            listed below:
          </p>
        </div>
      )}

      {/* Accordion for Strengths, Weaknesses, Recommendations */}
      <Accordion allowMultiple className="mt-4">
        {/* Strengths */}
        {feedback.strengths && (
          <AccordionItem id="strengths">
            <AccordionHeader itemId="strengths" className="text-2xl font-bold text-green-700">
              Strengths
            </AccordionHeader>
            <AccordionContent itemId="strengths">
              <ul className="list-disc list-inside ml-4">
                {feedback.strengths.map((item: string, idx: number) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Weaknesses */}
        {feedback.weaknesses && (
          <AccordionItem id="weaknesses">
            <AccordionHeader itemId="weaknesses" className="text-2xl font-bold text-red-600">
              Weaknesses
            </AccordionHeader>
            <AccordionContent itemId="weaknesses">
              <ul className="list-disc list-inside ml-4">
                {feedback.weaknesses.map((item: string, idx: number) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Recommendations */}
        {feedback.recommendations && (
          <AccordionItem id="recommendations">
            <AccordionHeader
              itemId="recommendations"
              className="text-2xl font-bold text-yellow-500">
              Recommendations
            </AccordionHeader>
            <AccordionContent itemId="recommendations">
              <ul className="list-disc list-inside ml-4">
                {feedback.recommendations.map((item: string, idx: number) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </div>
  );
};

export default Summary;
