// src/components/NNQCModuleView.jsx
import React, { useEffect, useState } from "react";
import "../pages/NNQC.css";

const DATA = {
  training: {
    label: "Training",
    thumb: "/nnqc/training.png",
    modules: {
      "train-pipe": {
        title: "Training pipeline",
        img: "/nnqc/training.png",
        desc: [
          "During the training phase, nnQC learns how to recognize and reconstruct anatomically valid segmentations. It does this by taking a perfect segmentation mask (ground truth), compressing it into a latent representation, adding controlled noise, and training a UNet to reverse that noise — guided by intelligent context provided by the ToE Module.",
          "The system is trained to denoise corrupted representations of segmentation masks and produce accurate outputs. This teaches the model what high-quality segmentations look like — even when the input is degraded or incomplete."
        ]
      },
      "input": {
        title: "Ground Truth",
        img: "/nnqc/GT.png",
        desc: [
          "The ground truth mask (GT) is a clean, manually annotated segmentation of the target organ — often created by medical experts. It defines the correct shape, location, and boundaries of the organ. This high-quality mask is used only during training, serving as the model’s gold standard for learning what a “good” segmentation looks like.",
          "Before being used, the GT mask is passed through a VAE encoder, which compresses it into a latent vector called z₀. This latent representation is a compact version of the mask that retains its essential structural information in a form that's easier to manipulate mathematically. It is from this vector that the entire training process begins."
        ]
      },
      "vae-encoder": {
        title: "Variational Autoencoder - Encoder",
        img: "/nnqc/VAE.png",
        desc: [
          "The VAE Encoder takes the GT mask and converts it into z₀, a dense, continuous latent vector. This vector contains all the necessary information about the organ’s shape, but in a compressed format — not directly viewable as an image, but ideal for neural network processing.",
          "Once we have z₀, nnQC simulates poor-quality masks by applying progressive Gaussian noise to it. This produces zₜ, a noisy version of z₀ that no longer resembles a clean segmentation. The network is then trained to reverse this corruption, learning to recover z₀ from zₜ."
        ]
      },
      "diffusion-model": {
        title: "Forward Diffusion Process",
        img: "/nnqc/diffusion.png",
        desc: [
          'The diffusion module is a mathematical process used to degrade z₀ into zₜ. It adds random noise step-by-step, mimicking the real-world degradation of segmentations due to poor prompts or model failures. This process helps the model experience a wide range of possible "bad masks" during training.',
          "What makes diffusion powerful is that it's reversible — and this is where the UNet comes in. By learning how to denoise zₜ back into z₀, the model gains the ability to fix or even generate realistic masks from highly degraded inputs."
        ]
      },
      "unet-noise": {
        title: "UNet Noise Predictor",
        img: "/nnqc/UNet.png",
        desc: [
          "The UNet is the core neural network of the system. It receives the noisy latent input (zₜ) and the conditioning vector (c), and its job is to predict the noise that was added during the diffusion process.",
          "During training, the UNet doesn’t directly predict the mask — it predicts the noise that should be subtracted from zₜ to recover z₀. This forces the network to learn how to clean up corrupted masks in a structured, anatomically aware way."
        ]
      },
      "c": {
        title: "Conditioning Vector",
        img: "/nnqc/c.png",
        desc: [
          "The conditioning vector c is a high-level representation of what the model has learned from the image and the segmentation mask. It serves as a form of guidance that helps the UNet understand where to focus, even when the input is distorted or noisy.",
          "Rather than modifying the input directly, c informs the denoising process — acting like a contextual compass that helps the UNet predict the right noise to remove from zₜ, so that the output moves closer to a clean z₀."
        ]
      },
      "predicted-noise": {
        title: "Predicted Noise",
        img: "/nnqc/predicted_noise.png",
        desc: [
          "The output of the UNet is the estimated noise that was added earlier to z₀. By subtracting this noise from zₜ, the model can recover a clean, denoised latent vector — ideally very close to the original z₀.",
          "This output completes the training loop. By comparing the reconstructed z₀ to the original, the system learns how well it denoised — and adjusts its weights accordingly. Over time, this teaches nnQC to generate realistic segmentations even from highly degraded or completely random starting points."
        ]
      },
      toe: {
        title: "Team of Experts (ToE)",
        img: "/nnqc/ToE.png",
        desc: [
          "The Team of Experts (ToE) module gives nnQC its critical ability to interpret and evaluate segmentations in context. It does this by analyzing two inputs simultaneously: the predicted segmentation mask and the corresponding raw medical image. These are processed through two separate neural networks that each act as a “domain expert,” producing what we call opinions about the current case.",
          'The outputs of these networks are combined using a cross-attention mechanism, which allows the system to align what the segmentation "claims" with what the image actually "shows." The result is a single, rich conditioning vector that guides the downstream generation process. This is how nnQC can adapt to a wide range of inputs and predict whether a segmentation is anatomically reasonable — even without seeing the ground truth.'
        ],
        elements: {
          input_mask: {
            title: "Input Mask",
            img: "/nnqc/input_mask.png",
            desc: [
              "The input mask is the segmentation result predicted by an external model, such as MedSAM, MIDeepSeg, or ScribblePrompt. It represents the system’s current understanding of where the organ is located in the medical image. However, this mask is not guaranteed to be accurate — it might be incomplete, misplaced, or structurally wrong, especially if the prompt used to generate it was poor or random.",
              'This predicted mask is used as input to the N₁ encoder in the ToE module. Rather than being accepted blindly, the mask is treated as an "opinion" that will be analyzed and compared with the anatomy visible in the image. The goal is not to trust the mask, but to understand it — to extract the shape and intent it carries, and then evaluate how well it aligns with real anatomical features.'
            ]
          },
          input_image: {
            title: "Input Image",
            img: "/nnqc/input_image.png",
            desc: [
              "The input image is the raw medical scan associated with the segmentation task. It could be a CT, MRI, or any other medical modality. This image contains the true anatomical structures, organ boundaries, and spatial context — it is the “reality” that the predicted mask is supposed to match.",
              'In the ToE module, the image is processed by the N₂ encoder, which extracts deep visual features that describe the anatomy in a learnable format. These features are crucial for understanding whether the predicted segmentation makes sense. They allow the system to reason about what is actually present in the scan, so it can confirm, correct, or reject the information coming from the segmentation mask.'
            ]
          },
          n1: {
            title: "N₁ – Mask Expert",
            img: "/nnqc/n1.png",
            desc: [
              "N₁ is a neural encoder dedicated to processing the segmentation mask. Whether the mask is clean, noisy, or partially incorrect, N₁ extracts structural features from it — such as shape, outline, and area distribution — and encodes them into a compact representation.",
              'This representation reflects what the model "believes" the segmentation is trying to describe. In a sense, N₁ expresses the segmentation’s point of view, highlighting what the predicted mask thinks the organ should look like.'
            ]
          },
          n2: {
            title: "N₂ – Image Expert",
            img: "/nnqc/n2.png",
            desc: [
              "N₂ is the second expert in the team, and its role is to interpret the raw medical image. It analyzes spatial textures, intensity gradients, and contextual patterns to extract features that describe what is actually visible in the scan.",
              "Unlike N₁, which only sees the segmentation mask, N₂ sees the anatomical truth embedded in the image — regardless of what the prediction claims. It contributes the objective clinical context to balance and complement the segmentation's interpretation."
            ]
          },
          o1o2: {
            title: "The two opinions",
            img: "/nnqc/o1o2.png",
            desc: [
              "The outputs from N₁ and N₂ are referred to as o₁ and o₂ — the “opinions” of each expert. These vectors are high-dimensional representations that summarize what each source (segmentation or image) contains.",
              "o₁ and o₂ are not yet aligned at this stage. They represent two different perspectives on the same case. The goal of the next steps is to fuse these views in a meaningful way — ensuring that both the predicted shape and the underlying anatomy influence the final decision."
            ]
          },
          F_Q: {
            title: "Query projection",
            img: "/nnqc/F_Q.png",
            desc: [
              'F_Q is the linear transformation that turns o₁ (the segmentation’s opinion) into a query. In attention mechanisms, the query expresses what we are trying to "find" or match.',
              "Here, the query from F_Q acts like a question: “Given this segmentation mask, what should I expect to see in the image?” It formalizes the segmentation’s expectations, preparing it to be compared against the image’s contents."
            ]
          },
          F_K: {
            title: "Key projection",
            img: "/nnqc/F_K.png",
            desc: [
              "F_K transforms o₂ — the image’s features — into a key, which defines what is actually present. Keys are used to determine which parts of the image match the current query.",
              "This process allows the model to pinpoint areas in the image that are most relevant to the predicted mask. In essence, it tells the system: “Here is where the anatomy aligns with the segmentation’s assumptions.”"
            ]
          },
          F_V: {
            title: "Value projection",
            img: "/nnqc/F_V.png",
            desc: [
              "F_V also comes from o₂, just like the key, but its purpose is different. It holds the actual content — the spatial and structural details of the image that will be used in constructing the final fused output.",
              "While the key is used for matching and alignment, the value provides the substance: the anatomical knowledge that will guide how the model corrects or confirms the predicted segmentation."
            ]
          },
          cross_attention: {
            title: "Cross Attention Module",
            img: "/nnqc/cross_attention.png",
            desc: [
              "The cross-attention module compares the query from F_Q (what the segmentation wants) with the keys from F_K (what the image has) and uses the values from F_V (the useful anatomical content) to compute a weighted representation.",
              "This mechanism ensures that the system doesn’t rely only on the segmentation or only on the image. Instead, it creates a dynamic balance, weighting each part according to how well it matches the other. The result is a unified understanding that integrates both perspectives."
            ]
          }
        }
      }
    }
  },

  inference: {
    label: "Inference",
    thumb: "/nnqc/inference.png",
    modules: {
      "infer-pipe": {
        title: "Inference pipeline",
        img: "/nnqc/inference.png",
        desc: [
          "During the inference phase, nnQC generates a pseudo-ground truth mask to estimate the quality of a given segmentation — without relying on any manual annotation. Instead of starting from an existing mask, the model begins with pure random noise and, guided by contextual information extracted from the image and the predicted segmentation, it constructs a realistic segmentation from scratch.",
          "This process is powered by a UNet trained during the earlier phase. The UNet receives the random noise and a conditioning vector c, which summarizes the anatomical and contextual cues extracted by the ToE Module. Step by step, the UNet transforms the unstructured input into a denoised, structured latent mask. This latent representation is then decoded by the VAE into an actual segmentation mask — the pseudo-ground truth (pGT). Finally, this pGT is compared to the predicted mask to compute a quality score, giving the system the ability to judge segmentations even when no ground truth is available."
        ]
      },
      "random-noise": {
        title: "Random Noise",
        img: "/nnqc/random-noise.png",
        desc: [
          "The inference process in nnQC begins with pure random noise — a latent input sampled from a standard Gaussian distribution. This input has no structure, no spatial coherence, and no anatomical meaning. It represents the most extreme case: a completely corrupted segmentation, as if the system were starting from zero knowledge about the organ’s shape or position.",
          "By using random noise as a starting point, nnQC forces the model to generate a segmentation entirely from learned priors and guidance, rather than from any predefined structure. This design ensures that the final output is not simply copied or slightly modified from the input, but is actively reconstructed using the information provided by the ToE Module. It’s a generative approach that reflects the system’s internal understanding of what a good mask should look like."
        ]
      },
      "UNet": {
        title: "UNet",
        img: "/nnqc/UNet-inf.png",
        desc: [
          "The UNet is the central neural network that drives the denoising process in inference. It was trained earlier to learn how to reverse noise in latent representations and produce segmentations that resemble clean, anatomically valid masks. During inference, it takes the unstructured random noise and, guided by the condition vector c, progressively transforms it into a structured, denoised latent vector.",
          "This latent output represents the model’s best guess of what the segmentation should look like, based on the given context. The UNet doesn’t work in pixel space — instead, it operates in the latent space where shapes and structures are more abstract. This allows it to capture high-level features like symmetry, organ shape, and expected size, and correct any inconsistencies as it denoises."
        ]
      },
      "c": {
        title: "Conditioning Vector",
        img: "/nnqc/c.png",
        desc: [
          "The conditioning vector c is what makes the generation process intelligent and context-aware. It is computed by the ToE Module using both the predicted segmentation and the original medical image. This vector encodes not just what the mask looks like, but how well it aligns with anatomical structures present in the scan.",
          "c acts like a guide for the UNet. It tells the model what to expect, where the organ likely is, and what kind of shape and texture it should have. Without this conditioning, the model would be trying to denoise blindly. With it, the system can adapt its reconstruction to match the specific case — making the generation more precise, consistent, and anatomically realistic."
        ]
      },
      "VAEd": {
        title: "Variational Autoencoder - Decoder",
        img: "/nnqc/VAEd.png",
        desc: [
          "After the UNet produces a denoised latent vector, this needs to be converted into an actual mask — something we can visualize and compare. That’s the job of VAE_D, the decoder. It is the inverse of the encoder used during training: instead of compressing a mask into a latent vector, it expands a latent vector into a full-resolution segmentation.",
          "This decoding step translates abstract features back into a binary (or probabilistic) mask, showing the spatial boundaries of the organ. It’s the final transformation that turns the model’s internal understanding into a usable output — the pseudo-ground truth."
        ]
      },
      "output": {
        title: "pGT – pseudo-ground truth",
        img: "/nnqc/pGT.png",
        desc: [
          "The final result of inference is the pseudo-ground truth (pGT) — a high-quality, realistic segmentation mask generated entirely by nnQC. It is not copied from any real annotation, but constructed from scratch based on the image and the prediction. The pGT simulates what a true mask would look like, allowing nnQC to compare it to the original prediction and estimate quality.",
          "This pGT is essential for nnQC’s role in quality control. Since the ground truth is often unavailable, pGT serves as a proxy. It lets the system measure how close the prediction is to what an expert would likely produce — without requiring any manual labeling."
        ]
      },
      "latent_mask": {
        title: "Latent Mask",
        img: "/nnqc/latent-mask.png",
        desc: [
          "The latent mask refers to the denoised latent vector produced by the UNet, right before it is decoded by the VAE. It is a structured, compressed representation of the final segmentation — still in the latent space, but already containing the organ’s shape, boundaries, and size in a learned, abstract format.",
          "Although not directly viewable as an image, the latent mask is where the core reasoning of the model happens. It bridges the gap between raw noise and final output. It is also where the influence of the conditioning vector c is fully realized — shaping the reconstruction to reflect anatomical reality, before the VAE turns it into a visible mask."
        ]
      },
      toe: {
        title: "Team of Experts (ToE)",
        img: "/nnqc/ToE.png",
        desc: [
          "The Team of Experts (ToE) module gives nnQC its critical ability to interpret and evaluate segmentations in context. It does this by analyzing two inputs simultaneously: the predicted segmentation mask and the corresponding raw medical image. These are processed through two separate neural networks that each act as a “domain expert,” producing what we call opinions about the current case.",
          'The outputs of these networks are combined using a cross-attention mechanism, which allows the system to align what the segmentation "claims" with what the image actually "shows." The result is a single, rich conditioning vector that guides the downstream generation process. This is how nnQC can adapt to a wide range of inputs and predict whether a segmentation is anatomically reasonable — even without seeing the ground truth.'
        ],
        elements: {
          input_mask: {
            title: "Input Mask",
            img: "/nnqc/input_mask.png",
            desc: [
              "The input mask is the segmentation result predicted by an external model, such as MedSAM, MIDeepSeg, or ScribblePrompt. It represents the system’s current understanding of where the organ is located in the medical image. However, this mask is not guaranteed to be accurate — it might be incomplete, misplaced, or structurally wrong, especially if the prompt used to generate it was poor or random.",
              'This predicted mask is used as input to the N₁ encoder in the ToE module. Rather than being accepted blindly, the mask is treated as an "opinion" that will be analyzed and compared with the anatomy visible in the image. The goal is not to trust the mask, but to understand it — to extract the shape and intent it carries, and then evaluate how well it aligns with real anatomical features.'
            ]
          },
          input_image: {
            title: "Input Image",
            img: "/nnqc/input_image.png",
            desc: [
              "The input image is the raw medical scan associated with the segmentation task. It could be a CT, MRI, or any other medical modality. This image contains the true anatomical structures, organ boundaries, and spatial context — it is the “reality” that the predicted mask is supposed to match.",
              'In the ToE module, the image is processed by the N₂ encoder, which extracts deep visual features that describe the anatomy in a learnable format. These features are crucial for understanding whether the predicted segmentation makes sense. They allow the system to reason about what is actually present in the scan, so it can confirm, correct, or reject the information coming from the segmentation mask.'
            ]
          },
          n1: {
            title: "N₁ – Mask Expert",
            img: "/nnqc/n1.png",
            desc: [
              "N₁ is a neural encoder dedicated to processing the segmentation mask. Whether the mask is clean, noisy, or partially incorrect, N₁ extracts structural features from it — such as shape, outline, and area distribution — and encodes them into a compact representation.",
              'This representation reflects what the model "believes" the segmentation is trying to describe. In a sense, N₁ expresses the segmentation’s point of view, highlighting what the predicted mask thinks the organ should look like.'
            ]
          },
          n2: {
            title: "N₂ – Image Expert",
            img: "/nnqc/n2.png",
            desc: [
              "N₂ is the second expert in the team, and its role is to interpret the raw medical image. It analyzes spatial textures, intensity gradients, and contextual patterns to extract features that describe what is actually visible in the scan.",
              "Unlike N₁, which only sees the segmentation mask, N₂ sees the anatomical truth embedded in the image — regardless of what the prediction claims. It contributes the objective clinical context to balance and complement the segmentation's interpretation."
            ]
          },
          o1o2: {
            title: "The two opinions",
            img: "/nnqc/o1o2.png",
            desc: [
              "The outputs from N₁ and N₂ are referred to as o₁ and o₂ — the “opinions” of each expert. These vectors are high-dimensional representations that summarize what each source (segmentation or image) contains.",
              "o₁ and o₂ are not yet aligned at this stage. They represent two different perspectives on the same case. The goal of the next steps is to fuse these views in a meaningful way — ensuring that both the predicted shape and the underlying anatomy influence the final decision."
            ]
          },
          F_Q: {
            title: "Query projection",
            img: "/nnqc/F_Q.png",
            desc: [
              'F_Q is the linear transformation that turns o₁ (the segmentation’s opinion) into a query. In attention mechanisms, the query expresses what we are trying to "find" or match.',
              "Here, the query from F_Q acts like a question: “Given this segmentation mask, what should I expect to see in the image?” It formalizes the segmentation’s expectations, preparing it to be compared against the image’s contents."
            ]
          },
          F_K: {
            title: "Key projection",
            img: "/nnqc/F_K.png",
            desc: [
              "F_K transforms o₂ — the image’s features — into a key, which defines what is actually present. Keys are used to determine which parts of the image match the current query.",
              "This process allows the model to pinpoint areas in the image that are most relevant to the predicted mask. In essence, it tells the system: “Here is where the anatomy aligns with the segmentation’s assumptions.”"
            ]
          },
          F_V: {
            title: "Value projection",
            img: "/nnqc/F_V.png",
            desc: [
              "F_V also comes from o₂, just like the key, but its purpose is different. It holds the actual content — the spatial and structural details of the image that will be used in constructing the final fused output.",
              "While the key is used for matching and alignment, the value provides the substance: the anatomical knowledge that will guide how the model corrects or confirms the predicted segmentation."
            ]
          },
          cross_attention: {
            title: "Cross Attention Module",
            img: "/nnqc/cross_attention.png",
            desc: [
              "The cross-attention module compares the query from F_Q (what the segmentation wants) with the keys from F_K (what the image has) and uses the values from F_V (the useful anatomical content) to compute a weighted representation.",
              "This mechanism ensures that the system doesn’t rely only on the segmentation or only on the image. Instead, it creates a dynamic balance, weighting each part according to how well it matches the other. The result is a unified understanding that integrates both perspectives."
            ]
          }
        }
      }
    }
  }
};

export default function NNQCModuleView() {
  const [phase, setPhase] = useState("training");
  // non ricaviamo più initialModule da phase, ma fissiamo a training/toe
  const [moduleKey, setModuleKey] = useState("input");
  const firstTrainingEltKey = Object.keys(DATA.training.modules.toe.elements)[0];
  const firstInferenceEltKey = Object.keys(DATA.inference.modules.toe.elements)[0];
  const [elementKey, setElementKey] = useState(firstTrainingEltKey);

  const onPhaseChange = (key) => {
    setPhase(key);
    if (key === "training") {
      setModuleKey("toe");
      setElementKey(firstTrainingEltKey);
    } else {
      setModuleKey("infer-pipe");
      // you could even jump straight to toe here if you want:
      // setModuleKey("toe");
      setElementKey(firstInferenceEltKey);
      //setElementKey(null);
    }
  };

  useEffect(() => { 
    if (phase !== "training") {
      setModuleKey("random-noise")
    }
  }, [phase]);
  

  return (
    <div className="nnqc-how">
      {/* PHASE SELECTOR */}
      <div className="phase-selector">
        {Object.entries(DATA).map(([key, { label }]) => (
          <button
            key={key}
            className={`select-box ${phase === key ? "active" : ""}`}
            onClick={() => onPhaseChange(key)}
          >
            <h3 style={{margin:'0'}}>{label}</h3>
          </button>
        ))}
      </div>

      {/* VISTA DINAMICA */}
      <PhaseView
        data={DATA[phase]}
        phase={phase}
        moduleKey={moduleKey}
        setModuleKey={setModuleKey}
        elementKey={elementKey}
        setElementKey={setElementKey}
      />
    </div>
  );
}

function PhaseView({
  data,
  phase,
  moduleKey,
  setModuleKey,
  elementKey,
  setElementKey,
}) {
  const Comp = phase === "training" ? TrainingPhase : InferencePhase;
  return (
    <Comp
      data={data}
      moduleKey={moduleKey}
      setModuleKey={setModuleKey}
      elementKey={elementKey}
      setElementKey={setElementKey}
    />
  );
}

// componete generico per hotspots con highlight
function MapHotspots({ baseImg, hotspots, selected, onSelect }) {
  // fallback su primo hotspot se selected non è in lista
  const sel =
    hotspots.find((h) => h.id === selected) || { id: null, box: hotspots[0].box };
  const clip = sel.id
    ? `inset(${sel.box.top}% ${100 - sel.box.left - sel.box.width}% ${
        100 - sel.box.top - sel.box.height
      }% ${sel.box.left}%)`
    : null;

  return (
    <div className="image-hotspot">
      <img className="base" src={baseImg} alt="pipeline" />
      {clip && (
        <img className="highlight" src={baseImg} alt="" style={{ clipPath: clip }} />
      )}
      {hotspots.map((h) => (
        <button
          key={h.id}
          className={`hotspot ${selected === h.id ? "active" : ""}`}
          style={{
            left: `${h.box.left}%`,
            top: `${h.box.top}%`,
            width: `${h.box.width}%`,
            height: `${h.box.height}%`,
          }}
          onClick={() => onSelect(h.id)}
        />
      ))}
    </div>
  );
}

function TrainingPhase({
  data,
  moduleKey,
  setModuleKey,
  elementKey,
  setElementKey,
}) {
  const pipeline = data.modules["train-pipe"];
  const mod = data.modules[moduleKey];

  const PIPE_HOTSPOTS = [
    { id: "input", box: { left: 1, top: 14, width: 13, height: 30 } },
    { id: "vae-encoder", box: { left: 18, top: 14, width: 10, height: 30 } },
    { id: "diffusion-model", box: { left: 36, top: 19, width: 15, height: 21 } },
    { id: "unet-noise", box: { left: 59, top: 14, width: 12, height: 30 } },
    { id: "c", box: { left: 60, top: 50, width: 10, height: 12 } },
    { id: "toe", box: { left: 56, top: 69, width: 18, height: 21 } },
    { id: "predicted-noise", box: { left: 79, top: 19, width: 18.5, height: 20 } },
  ];

  return (
    <>
      {/* descrizione fissa pipeline */}
      <div className="module-header">
        {pipeline.desc.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
        <MapHotspots
          baseImg={pipeline.img}
          hotspots={PIPE_HOTSPOTS}
          selected={moduleKey}
          onSelect={setModuleKey}
        />
      </div>

      {/* Sezione modulo selezionato */}
      {moduleKey === "toe" ?
      <div className="module-header">
        <div className="module-text">
          <h4>{mod.title}</h4>
          {mod.desc.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </div> :
        <div className="content-sel">
          <div className="image-sel"><img src={mod.img} alt={mod.title} /></div>
            <div className="module-text">
              <h4>{mod.title}</h4>
              {mod.desc.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </div>}

      {/* sub-moduli ToE */}
      {moduleKey === "toe" && (
        <>

          <div className="content-toe-sel">
            <div className="toe-sel">
                <MapHotspots
                baseImg={mod.img}
                hotspots={[
                  { id: "input_mask", box: { left: 4, top: 14, width: 14, height: 28 } },
                  { id: "input_image", box: { left: 4, top: 54, width: 14, height: 28 } },
                  { id: "n1", box: { left: 24.5, top: 13.5, width: 10.5, height: 30 } },
                  { id: "n2", box: { left: 24.5, top: 53.5, width: 10.5, height: 29 } },
                  { id: "o1o2", box: { left: 41, top: 22, width: 11, height: 52 } },
                  { id: "F_Q", box: { left: 58.5, top: 19.5, width: 9, height: 17.5 } },
                  { id: "F_K", box: { left: 58.5, top: 50.5, width: 9, height: 17 } },
                  { id: "F_V", box: { left: 58.5, top: 68, width: 9, height: 17.5 } },
                  {
                    id: "cross_attention",
                    box: { left: 75, top: 32, width: 21.5, height: 21 },
                  },
                ]}
                selected={elementKey}
                onSelect={setElementKey}
              />
            </div>
            <div className="content-sel">
              <div className="image-sel"><img src={mod.elements[elementKey].img} alt={mod.elements[elementKey].title} /></div>
                <div className="module-text">
                  <h4>{mod.elements[elementKey].title}</h4>
                  {mod.elements[elementKey].desc.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>
            </div>
              
        </>
      )}
    </>
  );
}

function InferencePhase({
  data,
  moduleKey,
  setModuleKey,
  elementKey,
  setElementKey,
}) {
  const pipeline = data.modules["infer-pipe"];
  const mod = data.modules[moduleKey];

  const PIPE_HOTSPOTS = [
    { id: "random-noise", box: { left: 5.5, top: 16, width: 18.5, height: 20.5 } },
    { id: "UNet", box: { left: 28, top: 11, width: 12.5, height: 30.5 } },
    { id: "c", box: { left: 29, top: 46, width: 10.5, height: 15 } },
    { id: "VAEd", box: { left: 64, top: 11, width: 10, height: 31 } },
    { id: "output", box: { left: 78, top: 11, width: 13, height: 31 } },
    { id: "latent_mask", box: { left: 44, top: 15, width: 16.5, height: 22.5 } },
    { id: "toe", box:{ left: 25, top: 65, width: 18.5, height: 22.5 }  },
  ];

  return (
    <>
      {/* descrizione fissa pipeline */}
      <div className="module-header">
        {pipeline.desc.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
        <MapHotspots
          baseImg={pipeline.img}
          hotspots={PIPE_HOTSPOTS}
          selected={moduleKey}
          onSelect={setModuleKey}
        />
      </div>

      {/* Sezione modulo selezionato */}
      {moduleKey === "toe" ?
      <div className="module-header">
        <div className="module-text">
          <h4>{mod.title}</h4>
          {mod.desc.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </div> :
        <div className="content-sel">
          <div className="image-sel"><img src={mod.img} alt={mod.title} /></div>
            <div className="module-text">
              <h4>{mod.title}</h4>
              {mod.desc.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </div>}

      {/* sub-moduli ToE */}
      {moduleKey === "toe" && (
        <>

          <div className="content-toe-sel">
            <div className="toe-sel">
                <MapHotspots
                baseImg={mod.img}
                hotspots={[
                  { id: "input_mask", box: { left: 4, top: 14, width: 14, height: 28 } },
                  { id: "input_image", box: { left: 4, top: 54, width: 14, height: 28 } },
                  { id: "n1", box: { left: 24.5, top: 13.5, width: 10.5, height: 30 } },
                  { id: "n2", box: { left: 24.5, top: 53.5, width: 10.5, height: 29 } },
                  { id: "o1o2", box: { left: 41, top: 22, width: 11, height: 52 } },
                  { id: "F_Q", box: { left: 58.5, top: 19.5, width: 9, height: 17.5 } },
                  { id: "F_K", box: { left: 58.5, top: 50.5, width: 9, height: 17 } },
                  { id: "F_V", box: { left: 58.5, top: 68, width: 9, height: 17.5 } },
                  {
                    id: "cross_attention",
                    box: { left: 75, top: 32, width: 21.5, height: 21 },
                  },
                ]}
                selected={elementKey}
                onSelect={setElementKey}
              />
            </div>
            <div className="content-sel">
              <div className="image-sel"><img src={mod.elements[elementKey].img} alt={mod.elements[elementKey].title} /></div>
                <div className="module-text">
                  <h4>{mod.elements[elementKey].title}</h4>
                  {mod.elements[elementKey].desc.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>
            </div>
              
        </>
      )}
    </>
  );
}