//
//  ChoiceQuestion.swift
//  PocketCards
//
//  Created by macmini on 2022/03/07.
//

import Alamofire
import Kingfisher
import SwiftUI

struct ChoiceQuestion: View {
    @State private var showingAlert = false
    @State private var showingConfirm = false
    @State private var isPresented = false
    @State private var fontSize: [CGFloat] = [24, 32, 40]
    @State private var fontIndex = 2

    var question: Question
    var isShowError: String
    var onChoice: (_: String) -> Void

    var body: some View {
        let qImage = question.title.getImage()

        VStack {
            ZStack {
                GeometryReader { geo in
                    Button {
                        onPlay()
                    } label: {
                        HStack {
                            Image(systemName: "speaker.wave.3")
                        }
                        .padding()
                        .border(Color.blue, width: 2)
                    }
                    .frame(width: 120, height: 48, alignment: .center)
                    .position(x: geo.size.width - 48, y: 48)
                    .zIndex(100)
                }
                HStack {
                    VStack {
                        Text(question.title.removeImage())

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
                                        ImageViewer(isShowing: $isPresented, name: qImage)
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
                                        ImageViewer(isShowing: $isPresented, name: qImage)
                                    }
                            }
                        }
                    }
                    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .leading)
                    .font(.system(size: fontSize[fontIndex], design: .default))
                    .padding(.leading, 32)
                    .border(Color.purple, width: 5)
                }
                .padding(.bottom, 8)
                .padding(.top, 8)
            }

            ForEach(0 ..< question.choices!.count, id: \.self) { idx in
                let item = question.choices![idx]
                let index = String(idx + 1)
                let isError: Bool = !self.isShowError.isEmpty ? self.isShowError == index : false

                ChoiceButton(text: item, index: index, isError: isError) {
                    self.onChoice(index)
                }
            }
        }
        .padding(.horizontal, 32)
        .padding(.vertical, 16)
        .navigationBarTitleDisplayMode(.inline)
        .toolbarBackground(Color.primaryColor, for: .navigationBar)
        .toolbarBackground(.visible, for: .navigationBar)
        .toolbar {
            ToolbarItem(placement: .navigationBarTrailing) {
                Button {
                    self.fontIndex = self.fontIndex == 2 ? 2 : self.fontIndex + 1
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

    func onPlay() {
        let url = question.voiceTitle

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

struct ChoiceQuestion_Previews: PreviewProvider {
    static var previews: some View {
        ChoiceQuestion(question: Question(id: "", groupId: "", title: "AAAA", choices: ["AAA", "BBBBB", "CCCCC", "DDDDD"], answer: "BBBB"), isShowError: "AAA", onChoice: { data in
            debugPrint(data)
        })
        .previewInterfaceOrientation(.landscapeLeft)
    }
}
