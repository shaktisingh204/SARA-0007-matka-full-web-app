import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownCircle, ArrowUpCircle, MessageSquare, BookText } from "lucide-react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { games } from "@/lib/data";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";


function ActionCard({ title, icon: Icon, href }: { title: string, icon: React.ElementType, href: string }) {
  return (
    <Link href={href}>
      <Card className="hover:bg-accent hover:text-accent-foreground transition-colors">
        <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-2">
          <Icon className="h-8 w-8 text-primary" />
          <p className="font-semibold">{title}</p>
        </CardContent>
      </Card>
    </Link>
  );
}


export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
       <Carousel
        opts={{
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {PlaceHolderImages.map((image) => (
            <CarouselItem key={image.id}>
              <div className="aspect-[2/1] overflow-hidden rounded-lg">
                <Image
                  src={image.imageUrl}
                  alt={image.description}
                  width={1200}
                  height={600}
                  className="object-cover w-full h-full"
                  data-ai-hint={image.imageHint}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ActionCard title="Deposit" icon={ArrowDownCircle} href="/wallet" />
        <ActionCard title="Withdraw" icon={ArrowUpCircle} href="/wallet" />
        <ActionCard title="WhatsApp" icon={MessageSquare} href="#" />
        <ActionCard title="How to Play" icon={BookText} href="/rules" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Game Markets</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Market Name</TableHead>
                <TableHead className="text-right">Open Time</TableHead>
                <TableHead className="text-right">Close Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {games.map((game) => (
                <TableRow key={game.id}>
                  <TableCell className="font-medium">{game.name}</TableCell>
                  <TableCell className="text-right font-mono">{game.openTime}</TableCell>
                  <TableCell className="text-right font-mono">{game.closeTime}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
