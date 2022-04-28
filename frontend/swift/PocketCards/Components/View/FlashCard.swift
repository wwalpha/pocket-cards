//
//  FlashCard.swift
//  PocketCards
//
//  Created by macmini on 2022/03/08.
//
import Kingfisher
import SwiftUI

struct FlashCard: View {
    @State private var flipped = false
    @State private var angle: Double = 0
    @State private var frontImage: Image?
    @State private var backImage: Image?

    var question: Question
    var action: (_: Bool) -> Void

    var body: some View {
        let qImage = question.title.getImage()
        let aImage = question.answer.getImage()

        GeometryReader { geo in
            VStack {
                ZStack {
                    Button {
                        onPlay(front: !flipped)
                    } label: {
                        HStack {
                            Image(systemName: "speaker.wave.3")
                        }
                        .padding()
                        .border(Color.blue, width: 2)
                    }
                    .frame(width: 120, height: 48, alignment: .center)
                    .position(x: geo.size.width - 92, y: 56)
                    .zIndex(100)

                    VStack {
                        Text(question.title.removeImage())

                        if !qImage.isEmpty {
                            // if file locally exist
                            if FileManager.default.fileExists(fileName: qImage) {
                                Image(uiImage: FileManager.default.loadImage(fileName: qImage)!)
                                    .resizable()
                                    .aspectRatio(contentMode: .fit)
                            } else {
                                // download image
                                let _ = DownloadManager.default.downloadFile(path: qImage)

                                KFImage(URL(string: DOMAIN_HOST + question.title.getImage())!)
                                    .resizable()
                                    .aspectRatio(contentMode: .fit)
                            }
                        }
                    }
                    .frame(width: geo.size.width * 0.9, height: geo.size.height * 0.7, alignment: .center)
                    .font(.system(size: 64, design: .default))
                    .padding()
                    .border(Color.purple, width: 5)
                    .background(Color.grey100)
                    .opacity(flipped ? 0.0 : 1.0)

                    VStack {
                        Text(question.answer.removeImage())

                        if !aImage.isEmpty {
                            // if file locally exist
                            if FileManager.default.fileExists(fileName: aImage) {
                                Image(uiImage: FileManager.default.loadImage(fileName: aImage)!)
                                    .resizable()
                                    .aspectRatio(contentMode: .fit)
                            } else {
                                // download image
                                let _ = DownloadManager.default.downloadFile(path: aImage)

                                KFImage(URL(string: DOMAIN_HOST + question.title.getImage())!)
                                    .resizable()
                                    .aspectRatio(contentMode: .fit)
                            }
                        }
                    }
                    .frame(width: geo.size.width * 0.9, height: geo.size.height * 0.7, alignment: .center)
                    .font(.system(size: 64, design: .default))
                    .padding()
                    .border(Color.purple, width: 5)
                    .background(Color.green100)
                    .opacity(flipped ? 1.0 : 0.0)
                }
                .modifier(FlipEffect(flipped: $flipped, angle: angle, axis: (x: 0, y: 1)))
                .onTapGesture {
                    withAnimation(Animation.spring()) {
                        self.angle += 180
                    }
                    withAnimation(nil) {
                        if self.angle >= 360 {
                            self.angle = self.angle.truncatingRemainder(dividingBy: 360)
                        }
                    }
                }
                .padding(0)

                HStack {
                    Spacer()

                    Button(action: {
                        self.action(false)
                        self.angle = 0.0
                    }, label: {
                        Text("知らない")
                            .frame(maxWidth: geo.size.width * 0.25, maxHeight: 64, alignment: .center)
                            .padding()
                            .font(.largeTitle)
                            .foregroundColor(Color.white)
                            .background(Color.systemYellow)
                    })

                    Spacer()

                    Button(action: {
                        self.action(true)
                        self.angle = 0.0
                    }, label: {
                        Text("知ってる")
                            .frame(maxWidth: geo.size.width * 0.25, maxHeight: 64, alignment: .center)
                            .padding()
                            .font(.largeTitle)
                            .foregroundColor(Color.white)
                            .background(Color.green)
                    })

                    Spacer()
                }
                .padding(.top)

                Spacer()
            }
            .padding(.vertical, 16)
            .background(Color.grey50)
        }
    }

    func onPlay(front: Bool) {
        let url = front ? question.voiceTitle : question.voiceAnswer

        // download file if not exist
        let request = DownloadManager.default.downloadRequest(path: url)

        Task {
            _ = await request?.serializingDownloadedFileURL().response

            // play audio
            Audio.play(url: FileManager.default.getFileUrl(fileName: url))
        }
    }
}

struct FlipEffect: GeometryEffect {
    var animatableData: Double {
        get { angle }
        set { angle = newValue }
    }

    @Binding var flipped: Bool
    var angle: Double
    let axis: (x: CGFloat, y: CGFloat)

    func effectValue(size: CGSize) -> ProjectionTransform {
        DispatchQueue.main.async {
            self.flipped = self.angle >= 90 && self.angle < 270
        }

        let tweakedAngle = flipped ? -180 + angle : angle
        let a = CGFloat(Angle(degrees: tweakedAngle).radians)

        var transform3d = CATransform3DIdentity
        transform3d.m34 = -1 / max(size.width, size.height)

        transform3d = CATransform3DRotate(transform3d, a, axis.x, axis.y, 0)
        transform3d = CATransform3DTranslate(transform3d, -size.width / 2.0, -size.height / 2.0, 0)

        let affineTransform = ProjectionTransform(CGAffineTransform(translationX: size.width / 2.0, y: size.height / 2.0))

        return ProjectionTransform(transform3d).concatenating(affineTransform)
    }
}

struct FlashCard_Previews: PreviewProvider {
    static var previews: some View {
        let q = Question(id: "", groupId: "", title: "Front Side Front Side Front Side Front Side Front Side Front SideFront SideFront SideFront SideFront SideFront SideFront SideFront SideFront SideFront SideFront ", answer: "Back Side")

        FlashCard(question: q) { action in
            debugPrint(action)
        }
        .previewInterfaceOrientation(.landscapeLeft)
    }
}
