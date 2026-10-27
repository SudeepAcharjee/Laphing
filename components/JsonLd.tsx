export default function JsonLd() {
  const baseUrl = "https://thelaphing.com";

  const schemas = [
    // 1. WebSite Schema
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "The Laphing Co.",
      url: baseUrl,
      description:
        "Authentic Tibetan Laphing, spicy cold noodles, and soupy noodles kit delivered across Delhi and India. Experience Majnu Ka Tilla street food at home.",
      potentialAction: {
        "@type": "SearchAction",
        target: `${baseUrl}/?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },

    // 2. Organization Schema
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "The Laphing Co.",
      url: baseUrl,
      logo: `${baseUrl}/logomain.svg`,
      image: `${baseUrl}/og-image.jpg`,
      sameAs: [
        "https://www.instagram.com/thelaphingco",
      ],
      description:
        "The Laphing Co. brings Delhi's famous Majnu Ka Tilla Tibetan street food right to your doorstep. Fresh, authentic cold and soupy laphing ready in 5 minutes.",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Majnu-ka-tilla, New Aruna Nagar",
        addressLocality: "North Delhi",
        addressRegion: "Delhi",
        postalCode: "110054",
        addressCountry: "IN",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: "28.7011",
        longitude: "77.2285",
      },
    },

    // 3. LocalBusiness / FoodEstablishment (GEO & Local SEO)
    {
      "@context": "https://schema.org",
      "@type": "FoodEstablishment",
      name: "The Laphing Co. - Tibetan Street Food",
      image: `${baseUrl}/og-image.jpg`,
      url: baseUrl,
      servesCuisine: [
        "Tibetan",
        "Himalayan",
        "Asian Cold Noodles",
        "Street Food",
      ],
      priceRange: "₹₹",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Majnu-ka-tilla, New Aruna Nagar",
        addressLocality: "New Delhi",
        addressRegion: "Delhi",
        postalCode: "110054",
        addressCountry: "IN",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: "28.7011",
        longitude: "77.2285",
      },
      areaServed: [
        {
          "@type": "City",
          name: "Delhi",
        },
        {
          "@type": "City",
          name: "New Delhi",
        },
        {
          "@type": "Country",
          name: "India",
        },
      ],
      hasMenu: `${baseUrl}/checkout`,
    },

    // 4. Product Schema (E-commerce Rich Snippet)
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: "The Laphing Co. Signature Pack (3 Servings)",
      image: [
        `${baseUrl}/og-image.jpg`,
        `${baseUrl}/pack.png`,
      ],
      description:
        "Authentic Tibetan spicy cold noodles kit with hand-rolled gluten sheets, signature crushed red chilli oil, garlic relish, savory soy broth, and crunchy Wai Wai topping. Pack of 3 servings.",
      sku: "LAPHING-SIG-03",
      brand: {
        "@type": "Brand",
        name: "The Laphing Co.",
      },
      offers: {
        "@type": "Offer",
        url: `${baseUrl}/checkout`,
        priceCurrency: "INR",
        price: "249",
        priceValidUntil: "2027-12-31",
        availability: "https://schema.org/InStock",
        itemCondition: "https://schema.org/NewCondition",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        reviewCount: "148",
      },
    },

    // 5. Recipe Schema (AEO: Targets 'laphing recipe' & 'laphing at home')
    {
      "@context": "https://schema.org",
      "@type": "Recipe",
      name: "Traditional Tibetan Laphing at Home with Spicy Chilli Oil & Wai Wai",
      image: `${baseUrl}/og-image.jpg`,
      author: {
        "@type": "Organization",
        name: "The Laphing Co.",
      },
      datePublished: "2026-01-01",
      description:
        "A quick, mouthwatering Tibetan street food recipe for authentic spicy cold laphing and soupy laphing at home in under 5 minutes with signature roasted chilli oil and crunchy Wai Wai noodles.",
      prepTime: "PT5M",
      cookTime: "PT0M",
      totalTime: "PT5M",
      recipeYield: "3 servings",
      recipeCategory: "Street Food, Cold Noodles",
      recipeCuisine: "Tibetan",
      keywords:
        "laphing, spicy cold noodles, soupy noodles, tibetan street food, laphing at home, laphing recipe, laphing chilli oil, laphing in delhi, majnu ka tilla laphing, waiwai laphing",
      recipeIngredient: [
        "Fresh cold gluten and mung-bean noodle sheets",
        "Artisanal roasted Tibetan red chilli oil",
        "Infused garlic-soy vinegar seasoning",
        "Crispy crushed Wai Wai noodles topping",
        "Toasted sesame seeds and fresh scallions",
      ],
      recipeInstructions: [
        {
          "@type": "HowToStep",
          name: "Unpack Cold Noodles",
          text: "Unroll the chilled, bouncy gluten sheets onto a cutting board or shallow serving bowl.",
        },
        {
          "@type": "HowToStep",
          name: "Drizzle Chilli Relish & Sauces",
          text: "Pour the signature roasted Tibetan chilli oil and fragrant garlic-soy reduction over the noodles.",
        },
        {
          "@type": "HowToStep",
          name: "Add Wai Wai Crunch",
          text: "Top with crushed Wai Wai instant noodles, toasted sesame, and fresh spring onions.",
        },
        {
          "@type": "HowToStep",
          name: "Roll or Soup",
          text: "Roll tightly for iconic dry rolled laphing, or add 100ml of iced chilled broth for refreshing soupy laphing.",
        },
      ],
    },

    // 6. FAQPage Schema (AEO: Direct Question Answering for AI Engines like Perplexity, ChatGPT, Gemini)
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is Tibetan Laphing?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Laphing (or Laping) is a popular Tibetan street food made from mung bean starch or wheat gluten. Served ice-cold, it features translucent, slippery, and bouncy noodle rolls tossed in fiery roasted chilli oil, garlic water, soy sauce, and vinegar.",
          },
        },
        {
          "@type": "Question",
          name: "What is the difference between dry rolled Laphing and Soupy Laphing?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Dry rolled Laphing features gluten sheets wrapped tightly around spicy relish, garlic, and crunchy toppings like Wai Wai noodles, then cut into bite-sized cylinders. Soupy Laphing consists of cut flat noodles bathed in a chilled, tangy, garlic-chilli vinegar broth.",
          },
        },
        {
          "@type": "Question",
          name: "Why is Laphing famous in Delhi's Majnu Ka Tilla?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Majnu Ka Tilla (MKT), also known as Delhi's Little Tibet, is where Laphing achieved legendary cult street food status in India. Visitors flock to MKT's narrow Tibetan alleys specifically to eat freshly rolled cold laphing drenched in spicy red chilli oil.",
          },
        },
        {
          "@type": "Question",
          name: "What is Wai Wai Laphing?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Wai Wai Laphing is Delhi's most popular street variation where crushed crunchy Wai Wai instant noodles and seasoning are rolled inside the soft, gelatinous laphing sheets, creating a contrast of silky cold noodles and spicy crispy crunch.",
          },
        },
        {
          "@type": "Question",
          name: "Can I prepare authentic Laphing at home?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes! The Laphing Co. provides ready-to-assemble signature Laphing kits containing fresh cold noodle sheets, artisanal roasted chilli oil, garlic-soy seasoning, and Wai Wai crunch, allowing you to prepare authentic street-style Laphing at home in just 5 minutes.",
          },
        },
        {
          "@type": "Question",
          name: "How spicy is Tibetan Laphing chilli oil?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Tibetan Laphing chilli oil is slow-cooked with aromatic roasted red chillies, garlic, and Sichuan-style peppercorns. It delivers a deeply fragrant, tingling, and customizable level of heat that you can adjust to your personal spice tolerance.",
          },
        },
      ],
    },
  ];

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
