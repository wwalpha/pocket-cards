//
//  FlashCard.swift
//  PocketCards
//
//  Created by macmini on 2022/03/08.
//
import Alamofire
import Kingfisher
import SwiftUI

struct FlashCard: View {
    @State private var fontSize: [CGFloat] = [24, 32, 40, 48, 56, 64]
    @State private var fontIndex = 5
    @State private var angle: Double = 0
    @State private var frontImage: Image?
    @State private var backImage: Image?
    @State private var showingAlert = false
    @State private var showingConfirm = false
    @State private var isPresented = false
    @State private var isEditorPresented = false

    @State var flipped = false

    private var readOnly = false
    private var hideButton = false
    private var question: Question
    private var action: (_: Bool) -> Void

    init(question: Question, action: @escaping (_: Bool) -> Void) {
        self.init(flipped: false, readOnly: false, hideButton: false, question: question, action: action)
    }

    init(flipped: Bool, readOnly: Bool, hideButton: Bool, question: Question, action: @escaping (_: Bool) -> Void) {
        self.readOnly = readOnly
        self.flipped = flipped
        self.question = question
        self.action = action
        self.hideButton = hideButton
    }

    var body: some View {
        let qImage = question.title.getImage()

        GeometryReader { geo in
            VStack {
                if readOnly {
                    bodyView(size: geo.size)

                } else {
                    bodyView(size: geo.size)
                        .modifier(FlipEffect(flipped: $flipped, angle: angle, axis: (x: 0, y: 1)))
                }

                if !hideButton {
                    buttonsView(size: geo.size)
                }

                Spacer()
            }
            .padding(.vertical, 16)
            .background(Color.grey50)
            .navigationBarTitleDisplayMode(.inline)
            .toolbarBackground(Color.primaryColor, for: .navigationBar)
            .toolbarBackground(.visible, for: .navigationBar)
            .toolbar {
                if !qImage.isEmpty {
                    ToolbarItem(placement: .navigationBarTrailing) {
                        Button {
                            isEditorPresented = true
                        } label: {
                            Text("編集")
                                .frame(width: 64, height: 36, alignment: .center)
                                .background(Color.secondaryColor)
                                .foregroundColor(Color.white)
                                .cornerRadius(2)
                                .shadow(color: Color.black.opacity(0.3), radius: 5, x: 5, y: 5)
                        }.fullScreenCover(isPresented: $isEditorPresented) {
                            CanvasEditor(isShowing: $isEditorPresented, imageName: qImage)
                        }
                    }
                }
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button {
                        self.fontIndex = self.fontIndex == 5 ? 5 : self.fontIndex + 1
                    } label: {
                        Text("+")
                            .frame(width: 64, height: 36, alignment: .center)
                            .background(Color.secondaryColor)
                            .foregroundColor(Color.white)
                            .cornerRadius(2)
                            .shadow(color: Color.black.opacity(0.3), radius: 5, x: 5, y: 5)
                    }
                }
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button {
                        self.fontIndex = self.fontIndex == 0 ? 0 : self.fontIndex - 1
                    } label: {
                        Text("-")
                            .frame(width: 64, height: 36, alignment: .center)
                            .background(Color.secondaryColor)
                            .foregroundColor(Color.white)
                            .cornerRadius(2)
                            .shadow(color: Color.black.opacity(0.3), radius: 5, x: 5, y: 5)
                    }
                }
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button {
                        self.showingAlert = true
                    } label: {
                        Text("通報")
                            .frame(width: 96, height: 36, alignment: .center)
                            .background(Color.secondaryColor)
                            .foregroundColor(Color.white)
                            .cornerRadius(2)
                            .shadow(color: Color.black.opacity(0.3), radius: 5, x: 5, y: 5)
                    }.alert("警告", isPresented: $showingAlert) {
                        Button("確定", role: .destructive) {
                            report()
                        }
                    } message: {
                        Text("問題の内容が間違ってます。\n通報しますか？")
                    }.alert("ありがとうございます。", isPresented: $showingConfirm) {}
                }
            }
        }
    }

    @ViewBuilder
    func bodyView(size: CGSize) -> some View {
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
            .position(x: size.width - 92, y: 56)
            .zIndex(100)

            // question page
            questionView(size: size)
            // answer page
            answerView(size: size)
        }
        .gesture(DragGesture()
            .onEnded { value in
                if abs(value.translation.width) < 10 { return } // too small movement, ignore note: 10 is default value for minimumDistance
                if readOnly { return }

                withAnimation(Animation.spring()) {
                    if value.translation.width < 0 {
                        // swiped to left
                        self.angle -= 180
                    } else if value.translation.width > 0 {
                        // swiped to right
                        self.angle += 180
                    }
                }
                withAnimation(nil) {
                    if self.angle < 0 {
                        self.angle = 360 - self.angle
                    }
                    if self.angle >= 360 {
                        self.angle = self.angle.truncatingRemainder(dividingBy: 360)
                    }
                }
            }
        )
        .onTapGesture {
            withAnimation(Animation.spring()) {
                if readOnly {
                    self.angle = 0
                } else {
                    self.angle += 180
                }
            }
            withAnimation(nil) {
                if self.angle >= 360 {
                    self.angle = self.angle.truncatingRemainder(dividingBy: 360)
                }
            }
        }
        .padding(0)
    }

    @ViewBuilder
    func questionView(size: CGSize) -> some View {
        let qImage = question.title.getImage()
        let qText = question.title.removeImage().trimmingCharacters(in: .whitespacesAndNewlines)

        VStack {
            if !qText.isEmpty {
                Text(qText)
            }

            if !qImage.isEmpty {
                // if file locally exist
                if FileManager.default.fileExists(fileName: qImage) {
                    Image(uiImage: FileManager.default.loadImage(fileName: qImage)!)
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                        .onTapGesture {
                            isPresented = true
                        }
                        .fullScreenCover(isPresented: $isPresented) {
                            ImageViewer(isShowing: $isPresented, imageName: qImage)
                        }
                } else {
                    // download image
                    let _ = DownloadManager.default.downloadFile(path: qImage)

                    KFImage(URL(string: DOMAIN_HOST + question.title.getImage())!)
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                        .onTapGesture {
                            isPresented = true
                        }
                        .fullScreenCover(isPresented: $isPresented) {
                            ImageViewer(isShowing: $isPresented, imageName: qImage)
                        }
                }
            }
        }
        .frame(width: size.width * 0.9, height: size.height * 0.7, alignment: .center)
        .font(.system(size: fontSize[fontIndex], design: .default))
        .padding()
        .border(Color.purple, width: 5)
        .background(Color.grey100)
        .opacity(flipped ? 0.0 : 1.0)
    }

    @ViewBuilder
    func answerView(size: CGSize) -> some View {
        let aImage = question.answer.getImage()
        let aText = question.answer.removeImage().trimmingCharacters(in: .whitespacesAndNewlines)

        VStack {
            if !aText.isEmpty {
                Text(aText)
            }

            if !aImage.isEmpty {
                // if file locally exist
                if FileManager.default.fileExists(fileName: aImage) {
                    Image(uiImage: FileManager.default.loadImage(fileName: aImage)!)
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                        .onTapGesture {
                            isPresented = true
                        }
                        .fullScreenCover(isPresented: $isPresented) {
                            ImageViewer(isShowing: $isPresented, imageName: aImage)
                        }
                } else {
                    // download image
                    let _ = DownloadManager.default.downloadFile(path: aImage)

                    KFImage(URL(string: DOMAIN_HOST + question.title.getImage())!)
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                        .onTapGesture {
                            isPresented = true
                        }
                        .fullScreenCover(isPresented: $isPresented) {
                            ImageViewer(isShowing: $isPresented, imageName: aImage)
                        }
                }
            }
        }
        .frame(width: size.width * 0.9, height: size.height * 0.7, alignment: .center)
        .font(.system(size: fontSize[fontIndex], design: .default))
        .padding()
        .border(Color.purple, width: 5)
        .background(Color.green100)
        .opacity(flipped ? 1.0 : 0.0)
    }

    @ViewBuilder
    func buttonsView(size: CGSize) -> some View {
        HStack {
            Spacer()

            Button(action: {
                self.action(false)

                if !readOnly {
                    self.angle = 0.0
                }

            }, label: {
                Text("知らない")
                    .frame(maxWidth: size.width * 0.25, maxHeight: 64, alignment: .center)
                    .padding()
                    .font(.largeTitle)
                    .foregroundColor(Color.white)
                    .background(Color.systemYellow)
            })

            Spacer()

            Button(action: {
                self.action(true)

                if !readOnly {
                    self.angle = 0.0
                }

            }, label: {
                Text("知ってる")
                    .frame(maxWidth: size.width * 0.25, maxHeight: 64, alignment: .center)
                    .padding()
                    .font(.largeTitle)
                    .foregroundColor(Color.white)
                    .background(Color.green)
            })

            Spacer()
        }
        .padding(.top)
    }

    func onPlay(front: Bool) {
        let titleUrl = "voices/\(question.groupId)/\(question.voiceTitle ?? "")"
        let answerUrl = "voices/\(question.groupId)/\(question.voiceAnswer ?? "")"
        let url = front ? titleUrl : answerUrl

        debugPrint(url)
        // download file if not exist
        let request = DownloadManager.default.downloadRequest(path: url)

        Task {
            _ = await request?.serializingDownloadedFileURL().response

            // play audio
            Audio.play(url: FileManager.default.getFileUrl(fileName: url))
        }
    }

    func report() {
        let params = ["id": question.id]

        API.request(URLs.REPORTS_INQUIRY, method: .post, parameters: params).response { res in
            if let status = res.response?.statusCode {
                debugPrint(question.id, status)
            }

            showingConfirm = true
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
        let _ = Question(id: "", groupId: "", title: "Front Side Front Side Front Side Front Side Front Side Front SideFront SideFront SideFront SideFront SideFront SideFront SideFront SideFront SideFront SideFront ", answer: "Back Side")

//        FlashCard(question: q) { action in
//            debugPrint(action)
//        }
//        .previewInterfaceOrientation(.landscapeLeft)
    }
}
