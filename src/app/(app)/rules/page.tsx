
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const gameTypes = [
  {
    title: '1. Single (Ank)',
    content: [
      'You bet on one digit (0–9).',
      'If that digit is the result of the Open or Close pana sum, you win.',
      'Example: You bet on 5. If Open pana is 258, the sum is 15, so the single digit is 5. You win.',
    ],
  },
  {
    title: '2. Jodi / Pair',
    content: [
      'You bet on a pair of two digits (00–99).',
      'You win if that exact pair matches the Jodi result, which is made from the Open and Close single digits.',
      'Example: You bet on 28. If Open single is 2 and Close single is 8, the Jodi is 28 and you win.',
    ],
  },
  {
    title: '3. Patti / Panna',
    content: [
      'Patti means three-digit numbers (000–999).',
      'You win if your number matches the Open or Close patti.',
      'There are three main types: Single Patti, Double Patti, and Triple Patti.',
      'Example: You bet on 123. If the Open patti is 123, you win.',
    ],
  },
  {
    title: '4. Single Patti',
    content: [
      'A 3-digit number where all digits are different (e.g., 123, 589).',
      'Example: You bet on 678. If the winning patti is 678, you win.',
    ],
  },
  {
    title: '5. Double Patti',
    content: [
      'A 3-digit number with two identical digits (e.g., 112, 244).',
      'Example: You bet on 677. If the winning patti is 677, you win.',
    ],
  },
  {
    title: '6. Triple Patti',
    content: [
      'A 3-digit number with all three digits being the same (e.g., 111, 222).',
      'Example: You bet on 444. If the winning patti is 444, you win.',
    ],
  },
  {
    title: '7. Half Sangam',
    content: [
      'A combination bet involving one Ank (single digit) and one Patti (three-digit number).',
      'You win if your Ank matches the Open result and your Patti matches the Close result, or vice-versa.',
      'Example: Bet on Open Ank 5 and Close Patti 140. If the Open single is 5 and Close patti is 140, you win.',
    ],
  },
  {
    title: '8. Full Sangam',
    content: [
      'You combine two Pattis (Open Patti + Close Patti).',
      'You win if both your numbers match the Open and Close patti results exactly.',
      'Example: Bet on Open patti 456 and Close patti 789. If the results are Open=456 and Close=789, you win.',
    ],
  },
];

export default function RulesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          How to Play
        </h1>
        <p className="text-muted-foreground">
          Understanding the different Matka game types.
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {gameTypes.map((game, index) => (
          <AccordionItem value={`item-${index}`} key={index}>
            <AccordionTrigger className="font-headline text-lg">{game.title}</AccordionTrigger>
            <AccordionContent className="space-y-2 text-muted-foreground">
              {game.content.map((line, lineIndex) => (
                <p key={lineIndex}>{line}</p>
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
