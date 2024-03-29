//
//  DailyPracticeView.swift
//  PocketCards
//
//  Created by macmini on 2022/11/16.
//
//

import SwiftUI

struct DailyPracticeView: View {
    var interactor: DailyPracticeBusinessLogic?

    @ObservedObject var viewModel = DailyPracticeViewModel()

    var body: some View {
        VStack {
            if viewModel.status == ScreenStatus.LOADING {
                Text("Loading....").onAppear {
                    Task {
                        await interactor?.initialize()
                    }
                }
            } else if viewModel.status == ScreenStatus.FINISHED {
                Text("学習は終わりました")
                    .font(.system(size: 64, design: .default))
            } else {
//                if let question = viewModel.question {
//                    if question.choices != nil {
//                        ChoiceQuestion(
//                            question: question,
//                            qCount: 10,
//                            isShowError: viewModel.isShowError,
//                            onChoice: interactor!.onChoice
//                        )
//                    } else {
//                        // Society or Science
//                        FlashCard(question: question, action: interactor!.onAction)
//                    }
//                } else {
//                    Text("Loading2....")
//                }
                if viewModel.subject == SUBJECT.LANGUAGE {
                    languageView()
                } else {
                    generalView()
                }
            }
        }.onDisappear {
            viewModel.question = nil
            viewModel.subject = ""
            viewModel.mode = ""
            viewModel.status = ScreenStatus.LOADING

            interactor?.destory()
        }
    }

    @ViewBuilder
    func languageView() -> some View {
        if let question = viewModel.question {
            if question.choices != nil {
                ChoiceQuestion(
                    question: question,
                    qCount: 10,
                    isShowError: viewModel.isShowError,
                    onChoice: interactor!.onChoice
                )
            } else {
                // Society or Science
                FlashCard(question: question, action: interactor!.onAction)
            }
        } else {
            Text("Loading2....")
        }
    }

    @ViewBuilder
    func generalView() -> some View {
        if let question = viewModel.question {
            if question.choices == nil {
                if viewModel.mode == MODE.EXAM {
                    // Society or Science
                    FlashCard(flipped: false, readOnly: true, hideButton: false, question: question, action: interactor!.onAction)
                } else {
                    // Society or Science
                    FlashCard(question: question, action: interactor!.onAction)
                }
            }

            if question.choices != nil {
                ChoiceQuestion(
                    question: question,
                    qCount: 10,
                    isShowError: viewModel.isShowError,
                    onChoice: interactor!.onChoice
                )
            }
        } else {
            Text("Loading2....")
        }
    }
}

extension DailyPracticeView: DailyPracticeDisplayLogic {
    func showNext(model: DailyPracticeViewModel) {
        DispatchQueue.main.async {
            viewModel.status = model.status
            viewModel.isShowError = model.isShowError
            viewModel.question = model.question
        }
    }

    func onUpdate(model: DailyPracticeViewModel) {
        DispatchQueue.main.async {
            viewModel.status = model.status
            viewModel.isShowError = model.isShowError
        }
    }
}

extension DailyPracticeView {
    func configureView(loadUrl: String, subject: String, mode: String) -> some View {
        var view = self

        viewModel.mode = mode
        viewModel.subject = subject

        let interactor = DailyPracticeInteractor(loadUrl: loadUrl, subject: subject, mode: mode)
        let presenter = DailyPracticePresenter()

        view.interactor = interactor
        interactor.presenter = presenter
        presenter.view = view

        Task {
            await interactor.initialize()
        }

        return view
    }
}

struct DailyPracticeView_Previews: PreviewProvider {
    static var previews: some View {
        DailyPracticeView()
    }
}
