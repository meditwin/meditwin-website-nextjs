export const serviceCategories = [
  {
    id: "diagnostic",
    label: "Diagnostic Services",
  },
  {
    id: "ophthalmology",
    label: "Ophthalmology Eye Care",
  },
  {
    id: "gynaecology",
    label: "Gynecological Care",
  },
  {
    id: "optical",
    label: "Optical Services",
  },
];

export const servicesByCategory = {
  diagnostic: [
    {
      title: "OCT Eye Scans",
      image: "/images/testing/OCT-Scan.png",
      description:
        "Detailed retina imaging to catch hidden eye diseases early on.",
      slug: "oct-eye-scans",
      href: "/services/oct-eye-scans",
    },
    {
      title: "Maternal Health Screening.",
      image: "/images/testing/package.jpg",
      description:
        "Basic tests to monitor the mother?s health and general health.",
      slug: "medical-checkups",
      href: "/services/maternal-health-screening",
    },
    {
      title: "Testing Vision in the Field",
      image: "/images/testing/specialize.png",
      description:
        "Mapping your vision to detect Glaucoma fast.",
      slug: "visual-field-testing",
      href: "/services/visual-field-testing",
    },
  ],

  ophthalmology: [
    {
      title: "Advanced Cataract Surgery",
      image: "/images/services/advanced-catarac.png",
      description:
        "Advanced cataract care designed to restore clearer vision.",
      slug: "advanced-cataract-surgery",
      href: "/services/advanced-cataract-surgery",
    },
    {
      title: "Treatment of Glaucoma",
      image: "/images/testing/glucoma.jpg",
      description:
        "Check your eye pressure to prevent long-term vision loss.",
      slug: "glaucoma-treatment",
      href: "/services/glaucoma-management",
    },
    {
      title: "Diabetic Retinopathy",
      image: "/images/testing/diabetic-retinopathy.webp",
      description:
        "Checking retina blood vessels to protect your vision.",
      slug: "diabetic-retinopathy",
      href: "/services/diabetic-retinopathy",
    },
    {
      title: "Phacoemulsification",
      image: "/images/services/pacho.png",
      description:
        "Explore our minimally invasive procedure for precise and efficient cataract surgery.",
      slug: "phacoemulsification",
      href: "#",
    },
    {
      title: "Corneal Diseases",
      image: "/images/services/corneal.png",
      description:
        "Receive specialized care for various corneal conditions, ensuring optimal eye health.",
      slug: "corneal-diseases",
      href: "#",
    },
    {
      title: "Retina Surgery",
      image: "/images/services/retina.png",
      description:
        "Trust our expertise in retina surgery for the management of complex retinal conditions, ensuring optimal visual outcomes.",
      slug: "retina-surgery",
      href: "#",
    },
  ],

  gynaecology: [
    {
      title: "Prenatal & Postpartum Care",
      image: "/images/testing/pregnancy.jpg",
      description:
        "Medical care from your first trimester through postpartum recovery.",
      slug: "pregnancy-support",
      href: "/services/prenatal-and-postpartum-care",
    },
    {
      title: "PCOS & Cycle Management",
      image: "/images/testing/package.jpg",
      description:
        "Real help for irregular cycles, PCOS and pelvic pain.",
      slug: "menstrual-health",
      href: "/services/cycle-management-and-pcos",
    },
    {
      title: "Preventative Screenings",
      image: "/images/testing/specialize.png",
      description:
        "Pap smears and preventative screenings for everyday reproductive health.",
      slug: "gynecology-exams",
      href: "/services/preventative-screenings",
    },
  ],

  optical: [
    {
      title: "Prescription Glasses",
      image: "/images/testing/spectacle.png",
      description:
        "Prescription frames and high quality lenses for your everyday wear.",
      slug: "spectacles",
      href: "/services/prescription-glasses-and-exams",
    },
    {
      title: "Contact Lens Fitting",
      image: "/images/testing/Contact_lense.webp",
      description:
        "Fitting and supply for daily or monthly contact lenses.",
      slug: "contact-lenses",
      href: "/services/contact-lens-fitting",
    },
    {
      title: "Polarized UV Eyewear",
      image: "/images/testing/uv-glass.jpg",
      description:
        "Eyewear built to block out harmful sun rays.",
      slug: "uv-sunglasses",
      href: "/services/polarized-uv-eyewear",
    },
  ],
};
