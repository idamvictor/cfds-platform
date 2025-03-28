import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface PartnerLogo {
  name: string;
  logo: string;
  url: string;
}

export default function CryptoPartners() {
  const [hoveredLogo, setHoveredLogo] = useState<string | null>(null);

  const partners: PartnerLogo[] = [
    {
      name: "Bitcoin.se",
      logo: "https://res.cloudinary.com/dyp8gtllq/image/upload/v1740652807/Google_2011_logo-600x206_nilxnl.png",
      url: "https://bitcoin.se",
    },
    {
      name: "Bitcoin.com",
      logo: "https://res.cloudinary.com/dyp8gtllq/image/upload/v1740652807/Google_2011_logo-600x206_nilxnl.png",
      url: "https://bitcoin.com",
    },
    {
      name: "Change NOW",
      logo: "https://res.cloudinary.com/dyp8gtllq/image/upload/v1740652807/Google_2011_logo-600x206_nilxnl.png",
      url: "https://changenow.io",
    },
    {
      name: "Kraken",
      logo: "https://res.cloudinary.com/dyp8gtllq/image/upload/v1740652807/Google_2011_logo-600x206_nilxnl.png",
      url: "https://kraken.com",
    },
    {
      name: "Coinbase",
      logo: "https://res.cloudinary.com/dyp8gtllq/image/upload/v1740652807/Google_2011_logo-600x206_nilxnl.png",
      url: "https://coinbase.com",
    },
    {
      name: "NURI",
      logo: "https://res.cloudinary.com/dyp8gtllq/image/upload/v1740652807/Google_2011_logo-600x206_nilxnl.png",
      url: "https://nuri.com",
    },
    {
      name: "EXMO",
      logo: "https://res.cloudinary.com/dyp8gtllq/image/upload/v1740652807/Google_2011_logo-600x206_nilxnl.png",
      url: "https://exmo.com",
    },
    {
      name: "Bitonic",
      logo: "https://res.cloudinary.com/dyp8gtllq/image/upload/v1740652807/Google_2011_logo-600x206_nilxnl.png",
      url: "https://bitonic.nl",
    },
    {
      name: "PAYEER",
      logo: "https://res.cloudinary.com/dyp8gtllq/image/upload/v1740652807/Google_2011_logo-600x206_nilxnl.png",
      url: "https://payeer.com",
    },
    {
      name: "BTCX",
      logo: "https://res.cloudinary.com/dyp8gtllq/image/upload/v1740652807/Google_2011_logo-600x206_nilxnl.png",
      url: "https://btcx.com",
    },
    {
      name: "LocalBitcoins",
      logo: "https://res.cloudinary.com/dyp8gtllq/image/upload/v1740652807/Google_2011_logo-600x206_nilxnl.png",
      url: "https://localbitcoins.com",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-[#121826] dark">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl ">
                  Our Partners
                </h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Trusted cryptocurrency platforms we work with
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8 mt-12">
              {partners.map((partner) => (
                <Link
                  to={partner.url}
                  key={partner.name}
                  className="group relative flex items-center justify-center"
                  onMouseEnter={() => setHoveredLogo(partner.name)}
                  onMouseLeave={() => setHoveredLogo(null)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <motion.div
                    className="absolute inset-0 rounded-lg bg-accent/0 transition-colors duration-300 group-hover:bg-accent/10"
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: hoveredLogo === partner.name ? 1 : 0,
                      scale: hoveredLogo === partner.name ? 1.05 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                  />
                  <div className="relative h-16 w-full flex items-center justify-center">
                    <motion.div
                      initial={{ y: 0 }}
                      animate={{
                        y: hoveredLogo === partner.name ? -5 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                      className="w-full h-full flex items-center justify-center"
                    >
                      <img
                        src={partner.logo || "/placeholder.svg"}
                        alt={partner.name}
                        width={150}
                        height={40}
                        className="max-h-10 w-auto object-contain opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                      />
                    </motion.div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
