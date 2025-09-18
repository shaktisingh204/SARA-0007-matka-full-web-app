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
      'If that digit appears in either the Open or Close result, you win.',
      'Example: You bet on 5. If Open = 256 (sum is 13, so single digit is 3), Close = 470 (sum is 11, so single digit is 1). The single digit from open pana is not 5. But if the single digit from a pana is 5, you win. A better example: The single digit is what makes up the Jodi. For a result 128-12-480, the open single is 1 and the close single is 2. If you bet on 1 or 2, you win.',
    ],
  },
  {
    title: '2. Jodi / Pair',
    content: [
      'You bet on a pair of two digits (00–99).',
      'You win if that exact pair matches the two-digit result (Jodi).',
      'Example: You bet on 28. If the Jodi result is 28, you win.',
    ],
  },
  {
    title: '3. Patti / Panna',
    content: [
      'Patti means three-digit numbers (000–999).',
      'Three main types: Single Patti, Double Patti, Triple Patti.',
      'Example: You bet on 123. If Open pana = 123 or Close pana = 123, you win.',
    ],
  },
  {
    title: '4. Single Patti',
    content: [
      'A 3-digit number with all different digits (like 123, 589).',
      'Example: You bet on 678. If Close pana = 678, you win.',
    ],
  },
  {
    title: '5. Double Patti',
    content: [
      'A 3-digit number with two same digits (like 112, 244, 500).',
      'Example: You bet on 677. If result pana = 677, you win.',
    ],
  },
  {
    title: '6. Triple Patti',
    content: [
      'A 3-digit number with all three digits same (like 000, 111, 222).',
      'Example: You bet on 444. If result pana = 444, you win.',
    ],
  },
  {
    title: '7. Half Sangam',
    content: [
      'Combination bet: One part from Jodi (pair) and another part from a Patti (Single, Double, or Triple).',
      'You win if one matches Open and the other matches Close.',
      'Example: Bet on Open Patti = 123 and Close Single = 4. If Open pana is 123 and Close single is 4, you win.',
    ],
  },
  {
    title: '8. Full Sangam',
    content: [
      'You combine two Pattis (Open Patti + Close Patti).',
      'You win if both match exactly in their respective places.',
      'Example: You bet Open = 456, Close = 789. If actual Open pana = 456 and Close pana = 789, you win.',
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
